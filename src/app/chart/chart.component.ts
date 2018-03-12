import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { PremiumService } from '../premium.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import {TopupInputComponent } from '../topup-input/topup-input.component';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit {
  avaliableFields = ['NAR', 'Surrender Value', 'COI', 'Death Benefit'];
  input = {
    topup: [],
    withdrawal: []
  }
  sliderValues = [0, 70];
  chart;
  raw;
  originds;
  ctx;
  a;
  p;
  sv;
  av;


  maxIndex = 100;
  rtn = 'MEDIUM';
  tableData = [];
  fm = 200000;
  age = 30;
  ps;
  y;
  loading;
  ds;
  showTable = false;

  displayedColumns;
  dataSource;
  defaultColumns = ['Year', 'Age', "Account Value (" + this.rtn + ")"]




  OptionalFields = [];
  proposalData = {
    age: [],
    year: [],
    premium: [],
    origin_premium: [],
    surrenderValue: [],
    accountValue: [],
    origin_accountValue: [],
  };

  update() {
    this.loadData();
  }

  constructor(ps: PremiumService,
    public dialog: MatDialog
  ) {
    this.ps = ps;
  }

  toggleOrigin() {
    this.chart.config.data.datasets
      .forEach(
      (e, i) => {
        if (e.label.indexOf('Origin') > -1) {
          this.chart.getDatasetMeta(i).hidden = !this.chart.getDatasetMeta(i).hidden;
          console.log(i)
        }
      }
      );

    this.chart.update(0);

  }

  showSlider() {
    if (!this.chart) return;

    let xAxis = this.chart.scales['x-axis-0'];

    var el = document.getElementById("slider");
    el.style.display = 'block';
    el.style.top = xAxis.top + 'px';
    el.style.left = xAxis.left + 20 + 'px';
    el.style.width = xAxis.width + 'px';


  }

  loadData() {
    this.loading = true;
    this.ps.getData({ faceAmt: this.fm, age: this.age }).subscribe(data => {
      this.loading = false;
      this.raw = data;
      this.ds = data.projections[0].columns;
      if (!this.originds) {
        this.originds = this.ds;
      }
      this.createChart();
    });
  }

  setReturn(rtn) {
    this.rtn = rtn;
    this.createChart();
  }

  updateOptionalFields(fieldName) {
    if (this.hasOptionalFields(fieldName)) {
      this.OptionalFields = this.OptionalFields.filter(x => x != fieldName);
    }
    else {
      this.OptionalFields.push(fieldName);
    }
    console.log(this.OptionalFields)
  }

  hasOptionalFields(fieldName) {
    return this.OptionalFields.includes(fieldName);
  }

  getShowTable() {
    if (this.proposalData['Year'])
      return this.proposalData['Year'].filter(i => i <= this.sliderValues[1] + 1);
  }

  getPremiums() {
    let premiums = this.proposalData["Total Premium"]
    let topup = this.getInput()

    premiums = premiums.map((p, i) => {
      var t = topup.topups.filter(x => x.year == i + 1)[0];
      var w = topup.withdrawals.filter(x => x.year == i + 1)[0];

      console.log(t)
      if (t) {
        p += +t.amount;
      }
      if (w) {
        p -= +w.amount;
      }
      console.log(t, w);
      return p;
    })
    console.log(premiums)


    return premiums;
  }

  openDialog(object, index ): void {
    let dialogRef = this.dialog.open(TopupInputComponent, {
      width: '300px',
      data: {
        value : object[index];
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result);
      console.log(object);
      console.log(index);
      for(var i = 0; i < result.year; i++) {
        object[index + i] = result.value;
      }
    });
  }

  createChart() {
    let fields = this.ds.map(x => x.Name)
    console.log(fields)

    fields.forEach(
      f => {
        this.proposalData[f] = this.ds.filter(x => x.Name == f)[0].Values.map(x => x.value > 0 ? x.value : 0);
      }
    )


    this.proposalData.origin_premium = this.originds.filter(x => x.Name == "Total Premium")[0].Values.map(x => x.value);
    this.proposalData.origin_accountValue = this.originds.filter(x => x.Name == "Account Value (" + this.rtn + ")")[0].Values.map(x => x.value > 0 ? x.value : 0);


    this.proposalData["Age"].forEach(
      (x, i) => {
        let row = {}
        fields.forEach(
          f => {
            row[f] = this.proposalData[f][i];
          }
        )
        this.tableData.push(row)
      }
    )
    //this.displayedColumns = ['position', 'name', 'weight', 'symbol'];//fields;
    this.displayedColumns = this.defaultColumns;
    this.dataSource = this.tableData;//this.tableData;


    this.maxIndex = this.proposalData["Age"].length - 1;
    // /console.log(this.maxIndex)
    this.sliderValues = [0, this.maxIndex];

    var chartData = {
      labels: this.proposalData["Age"],
      datasets: [
        {
          type: 'line',
          label: 'Origin Premium Paid',
          backgroundColor: '#FF0000',
          borderColor: '#FF0000',
          borderDash: [5, 5],
          borderWidth: 2,
          fill: false,
          data: this.proposalData["Total Premium"]
        },
        {
          type: 'line',
          label: 'Cumulative Premium Paid (with Topup and withdrawal)',
          backgroundColor: '#FF0000',
          borderColor: '#FF0000',

          borderWidth: 2,
          fill: false,
          data: this.getPremiums()
        },
        /*{
          type: 'line',
          label: 'Cumulative Premium Paid (original)',
          borderColor: '#00FF00',
          borderWidth: 2,
          fill: false,
          data: this.proposalData["Total Premium"]
        },
        {
          type: 'line',
          label: 'Allocated Premium',
          borderColor: '#00DD00',
          borderWidth: 2,
          fill: false,
          data: this.proposalData["Total Premium"].map(
            (x, i) => x - this.proposalData["COI (" + this.rtn + ")"][i]
          ) //fake formula, it should come from product engine later
        },
        */
        {
          type: 'bar',
          label: 'Origin Account Value',
          backgroundColor: 'rgba(0, 255, 0, 0.5)',
          data: this.proposalData.origin_accountValue
        },
        {
          type: 'bar',
          label: 'Account Value (Guaranteed)',
          backgroundColor: 'rgba(100, 100, 255, 1)',
          data: this.proposalData["Account Value (" + this.rtn + ")"]
        },
        {
          type: 'bar',
          label: 'Account Value (Non guaranteed)',
          backgroundColor: 'rgba(200, 200, 255, 1)',
          data: this.proposalData["Account Value (" + this.rtn + ")"].map(x => x * 1.25) //fake formula, it should come from product engine later
        },
        {
          type: 'bar',
          label: 'Surrender Value',
          data: this.proposalData.surrenderValue,
          borderColor: 'rgba(255, 0, 0, 0.5)',
          borderWidth: 2
        }
      ]

    };
    let canvas = <HTMLCanvasElement>document.getElementById("canvas");
    this.ctx = canvas.getContext("2d");
    if (this.chart) {
      this.chart.destroy();
    }
    this.chart = new Chart(this.ctx, {
      type: 'bar',
      data: chartData,
      options: {
        responsive: true,
        title: {
          display: true,
          text: 'Quick POC of interactive table with chartJS'
        },
        tooltips: {
          enabled: false
        },
        scales: {
          xAxes: [
            {
              stacked: true
            }
          ],
          yAxes: [{
            stacked: false,
            ticks: {
              beginAtZero: true
            }
          }]
        },
        //onClick: (clickEvt, activeElems) => this.onChartClick(clickEvt, activeElems)
      }
    });
    this.chart.update();
    this.toggleOrigin();
  }
  getInput() {
    return {
      topups:
      this.input.topup.map(
        (t, i) => {
          return {
            amount: t,
            year: i + 1
          }
        }
      ).filter(t => t.amount)
      ,
      withdrawals:
      this.input.withdrawal.map(
        (t, i) => {
          return {
            amount: t,
            year: i + 1
          }
        }
      ).filter(t => t.amount)
    }
  }
  ngOnInit() {
    this.loadData();

  }

}


const ELEMENT_DATA = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
  { position: 11, name: 'Sodium', weight: 22.9897, symbol: 'Na' },
  { position: 12, name: 'Magnesium', weight: 24.305, symbol: 'Mg' },
  { position: 13, name: 'Aluminum', weight: 26.9815, symbol: 'Al' },
  { position: 14, name: 'Silicon', weight: 28.0855, symbol: 'Si' },
  { position: 15, name: 'Phosphorus', weight: 30.9738, symbol: 'P' },
  { position: 16, name: 'Sulfur', weight: 32.065, symbol: 'S' },
  { position: 17, name: 'Chlorine', weight: 35.453, symbol: 'Cl' },
  { position: 18, name: 'Argon', weight: 39.948, symbol: 'Ar' },
  { position: 19, name: 'Potassium', weight: 39.0983, symbol: 'K' },
  { position: 20, name: 'Calcium', weight: 40.078, symbol: 'Ca' },
];
