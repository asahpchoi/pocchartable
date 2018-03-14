import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { PremiumService } from '../premium.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { TopupInputComponent } from '../topup-input/topup-input.component';

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

  ctx: CanvasRenderingContext2D;
  a;
  p;
  sv;
  av;

  maxIndex = 100;
  rtn = 'MEDIUM';
  tableData = [];
  fm = 200000;
  plannedPremium = 10000;
  age = 30;
  riders = [];

  ps;
  y;
  loading;
  ds;
  showTable = false;

  displayedColumns;
  dataSource;
  defaultColumns = ['Year', 'Age', "Account Value (" + this.rtn + ")"]
  selectedView = 'AV';


  OptionalFields = [];
  proposalData = {
  };

  viewDataSet;

  updateView() {
    if (this.selectedView == 'AV') {
      this.viewDataSet =
        [
          {
            type: 'line',
            label: 'Origin Premium Paid',
            backgroundColor: '#FF0000',
            borderColor: '#FF0000',
            borderDash: [5, 5],
            borderWidth: 2,
            pointRadius: 0,
            fill: false,
            data: this.proposalData["Total Premium"]
          },
          {
            type: 'line',
            label: 'Cumulative Premium Paid (with Topup and withdrawal)',
            backgroundColor: '#FF0000',
            borderColor: '#FF0000',
            pointRadius: 0,
            borderWidth: 2,
            fill: false,
            data: this.getPremiums()
          },
          {
            type: 'bar',
            label: 'Account Value (Guaranteed)',
            backgroundColor: 'rgba(100, 100, 255, 1)',
            data: this.proposalData["Account Value (LOW)"]
          },
          {
            type: 'bar',
            label: 'Account Value (Non guaranteed)',
            backgroundColor: 'rgba(200, 200, 255, 1)',
            data: this.proposalData["Account Value (" + this.rtn + ")"]//fake formula, it should come from product engine later
          }
        ];
    }
    if (this.selectedView == 'SV') {
      this.viewDataSet =
        [
          {
            type: 'line',
            label: 'Origin Premium Paid',
            backgroundColor: '#FF0000',
            borderColor: '#FF0000',
            borderDash: [5, 5],
            borderWidth: 2,
            pointRadius: 0,
            fill: false,
            data: this.proposalData["Total Premium"]
          },
          {
            type: 'line',
            label: 'Cumulative Premium Paid (with Topup and withdrawal)',
            backgroundColor: '#FF0000',
            borderColor: '#FF0000',
            pointRadius: 0,
            borderWidth: 2,
            fill: false,
            data: this.getPremiums()
          },
          {
            type: 'bar',
            label: 'Surrender Value (Guaranteed)',
            backgroundColor: 'rgba(100, 100, 255, 1)',
            data: this.proposalData["Surrender Value (LOW)"]
          },
          {
            type: 'bar',
            label: 'Surrender Value (Non guaranteed)',
            backgroundColor: 'rgba(200, 200, 255, 1)',
            data: this.proposalData["Surrender Value (" + this.rtn + ")"]//fake formula, it should come from product engine later
          }
        ];
    }
    if (this.selectedView == 'DB') {
      //console.log(this.proposalData)
      this.viewDataSet =
        [
          {
            type: 'line',
            label: 'Origin Premium Paid',
            backgroundColor: '#FF0000',
            borderColor: '#CC0000',
            borderDash: [5, 1],
            borderWidth: 2,
            pointRadius: 0,
            fill: false,
            data: this.proposalData["Total Premium"]
          },
          {
            type: 'line',
            label: 'Cumulative Premium Paid (with Topup and withdrawal)',
            backgroundColor: '#FF0000',
            borderColor: '#FF0000',
            pointRadius: 0,
            borderWidth: 2,
            fill: false,
            data: this.getPremiums()
          },
          {
            type: 'bar',
            label: 'Total Death Benefit (Guaranteed)',
            backgroundColor: 'rgba(100, 100, 255, 1)',
            data: this.proposalData["Death Benefit (LOW)"]
          },
          {
            type: 'bar',
            label: 'Total Death Benefit (Non guaranteed)',
            backgroundColor: 'rgba(200, 200, 255, 1)',
            data: this.proposalData["Death Benefit (" + this.rtn + ")"]//fake formula, it should come from product engine later
          }
        ];
    }
  }
  update() {
    this.loadData();
  }

  constructor(ps: PremiumService,
    public dialog: MatDialog
  ) {
    this.ps = ps;
  }

  toggleOrigin() {
    /*
    this.chart.config.data.datasets
      .forEach(
      (e, i) => {
        if (e.label.indexOf('Origin') > -1) {
          this.chart.getDatasetMeta(i).hidden = !this.chart.getDatasetMeta(i).hidden;
          //console.log(i)
        }
      }
      );
      */
    console.log('Toogle', this.selectedView)
    if (this.selectedView == 'TV') {
      this.setView('AV')
      this.createChart()
      //this.chart.update()
    }
    if (this.selectedView == 'AV') {
      this.setView('TV')
      this.createChart()
      //this.chart.update()
    }

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
  addRider() {
    this.riders.push(
      {
        productId: 'ADD03',
        fm: 800000,
        age: 27
      }
    );
  }
  deleteRider(index) {
    console.log(this.riders)
    this.riders.splice(index,1);
    //this.riders = [];
  }
  loadData() {
    this.loading = true;
    this.ps.getData(
      {
        faceAmt: this.fm,
        age: this.age,
        plannedPremium: this.plannedPremium,
        riders: this.riders
      }
    ).subscribe(data => {
      this.loading = false;
      this.raw = data;
      this.ds = data.projections[0].columns;
      this.createChart();
    });
  }
  setReturn(rtn) {
    this.rtn = rtn;
    //this.createChart();
  }
  setView(view) {
    this.selectedView = view;
    //this.createChart();
  }
  updateOptionalFields(fieldName) {
    if (this.hasOptionalFields(fieldName)) {
      this.OptionalFields = this.OptionalFields.filter(x => x != fieldName);
    }
    else {
      this.OptionalFields.push(fieldName);
    }

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

      return p + topup.topups.filter(x => x.year < i + 1).reduce(
        (prev, element) => {
          return prev + element.amount;
        }, 0
      );
    });

    return premiums;
  }

  openDialog(object, index): void {
    let dialogRef = this.dialog.open(TopupInputComponent, {
      width: '300px',
      data: {
        value: object[index]
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      for (var i = 0; i < result.year; i++) {
        object[index + i] = result.value;
      }
    });
  }

  createChart() {
    let fields = this.ds.map(x => x.Name)


    fields.forEach(
      f => {
        this.proposalData[f] = this.ds.filter(x => x.Name == f)[0].Values.map(x => x.value > 0 ? x.value : 0);
      }
    )
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
    this.displayedColumns = this.defaultColumns;
    this.dataSource = this.tableData;
    this.maxIndex = this.proposalData["Age"].length - 1;
    this.sliderValues = [0, this.maxIndex];

    this.updateView();
    var chartData = {
      labels: this.proposalData["Age"],
      datasets: this.viewDataSet
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
        tooltips: {
          enabled: true
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
        }
      }
    });
    this.chart.update();

    /*
        document.getElementById("canvas").onclick = function(evt) {
          var activePoints = this.chart.getElementsAtEventForMode(evt, 'point', this.chart.options);
          var firstPoint = activePoints[0];
          var label = this.chart.data.labels[firstPoint._index];
          var value = this.chart.data.datasets[firstPoint._datasetIndex].data[firstPoint._index];
          alert(label + ": " + value);
        };
        */
    //this.toggleOrigin();
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
