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
  avaliableFields = [`Total Death Benefit ($rtn)`, 'Premium Load', `COI ($rtn)`, `Loyalty Bonus ($rtn)`, 'Total Premium'];
  fullTableFields = ['Account Value ($rtn)', 'Surrender Value ($rtn)', 'Death Benefit ($rtn)']


  input = {
    topup: [],
    withdrawal: []
  }
  ui = {
    sliderValues: [0, 70],
    isLoading: true,
    step: 1
  }

  chart;
  ctx: CanvasRenderingContext2D;

  maxIndex = 100;
  rtn = 'LOW';
  tableData = [];
  ds;
  showTable = false;
  defaultColumns = ['Year', 'Age', "Account Value (" + this.rtn + ")"]
  selectedView = 'AV';

  premiumSvc;

  OptionalFields = [];
  proposalData = {
  };

  viewDataSet;

  constructor(
    premiumSvc: PremiumService,
    public dialog: MatDialog
  ) {
    this.premiumSvc = premiumSvc;
    this.loadData();
  }

  submitfundActivity() {
    //console.log(this.input)
    this.ui.isLoading = true;
    let fundActs =
      [
        ...this.input.topup.map((v, i) => {
          return {
            "attainAge": this.proposalData["Age"][i],
            "topupPremium": v
          }
        }
        ),
        ...this.input.withdrawal.map((v, i) => {
          return {
            "attainAge": this.proposalData["Age"][i],
            "withdrawal": v
          }
        }
        )
      ];


    this.premiumSvc.updateFundActivities(fundActs.filter(x => x));
    this.premiumSvc.submit();
    this.createChart(0);
    /*
    "attainAge": 42,
    "withdrawal": 300000.00
  }, {
    "attainAge": 48,
    "topupPremium": 1000000.00
    */
  }
  updateView() {
    if (this.selectedView == 'AV') {
      this.viewDataSet =
        [
          {
            type: 'line',
            label: 'Premium Paid',
            backgroundColor: 'rgba(0,0,0,0)',
            borderColor: '#EA7F75',
            borderDash: [5, 5],
            borderWidth: 2,
            pointRadius: 0,
            fill: false,
            data: this.proposalData["Total Premium"]
          },
          {
            type: 'bar',
            label: 'Account Value (Guaranteed)',
            backgroundColor: '#84B3E0',
            borderColor: 'rgba(0,0,0,0)',
            borderWidth: 1,
            data: this.proposalData["Account Value (LOW)"]
          },
          {
            type: 'bar',
            label: 'Account Value (Non guaranteed)',
            backgroundColor: '#3A539B',
            borderColor: 'rgba(0,0,0,0)',
            borderWidth: 1,
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
    this.ui.isLoading = true;
    this.premiumSvc.getData().throttleTime(500).subscribe(data => {
      //console.log('data', data)
      if (data) {
        this.ui.isLoading = false;
        this.ds = data.projections[0].columns;
        this.createChart(0);
      }
    });

  }
  setReturn(rtn) {
    this.rtn = rtn;
  }
  setView(view) {
    this.selectedView = view;
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
      return this.proposalData['Year'].filter(i => i <= this.ui.sliderValues[1] + 1);
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
      this.submitfundActivity();
      this.createChart(0)
    });
  }

  createChart(delay) {
    //('create chart');
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
    this.maxIndex = this.proposalData["Age"].length - 1;
    this.ui.sliderValues = [0, this.maxIndex];
    console.log("propose data", this.proposalData);
    this.updateView();
    let chartData = {
      labels: this.proposalData["Age"].filter((d, i) => i % this.ui.step == 0),
      datasets: this.viewDataSet
    };

    this.viewDataSet.forEach(
      x => {
        x.data = x.data.filter((d, i) => i % this.ui.step == 0)
      }
    )



    let canvas = <HTMLCanvasElement>document.getElementById("canvas");
    if (!canvas) return;
    if (this.chart) {
      this.chart.destroy();
    }

    this.ctx = canvas.getContext("2d");

    this.chart = new Chart(this.ctx, {
      type: 'bar',
      data: chartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: true,
          labels: {
            fontFamily: 'ClassicGrotesquePro-Book',
            fontSize: 12,
            fontColor: '#21212b',
            boxWidth: 12,
            padding: 30,
          }
        },
 
        tooltips: {
          enabled: false,
        },
        scales: {
          xAxes: [{
            stacked: true,
            gridLines: {
              display: false,
            },
            ticks: {
              fontFamily: 'ClassicGrotesquePro-Book',
              fontSize: 10,
              fontColor: '#737487',
              autoSkip: false,
              maxRotation: 0,
              minRotation: 0,
            }
          }],
          yAxes: [{
            stacked: false,
            gridLines: {
              color: 'rgba(212,212,222,1)',
              drawTicks: false,
            },
            ticks: {
              fontFamily: 'ClassicGrotesquePro-Book',
              fontSize: 10,
              fontColor: '#737487',
              beginAtZero: true,
              padding: 10,
            }
          }]
        }
      }
    });

    this.chart.update(0);
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

  }
}
