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
            borderColor: '#3A539B',
            borderWidth: 1,
            pointRadius: 0,
            fill: false,
            data: this.proposalData["Total Premium"]
          },
          {
            type: 'line',
            label: 'Account Value (Guaranteed)',
            backgroundColor: '#84B3E0',
            borderColor: 'rgba(0,0,0,0)',
            borderWidth: 1,
            pointRadius: 0,
            fill: true,
            data: this.proposalData["Account Value (LOW)"]
          },
          {
            type: 'line',
            label: 'Account Value (Non guaranteed)',
            backgroundColor: '#3A539B',
            borderColor: 'rgba(0,0,0,0)',
            borderWidth: 1,
            pointRadius: 0,
            fill: true,
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
            label: 'Surrender Value (Guaranteed)',
            backgroundColor: 'rgba(100, 100, 255, 1)',
            pointRadius: 0,
            fill: true,
            data: this.proposalData["Surrender Value (LOW)"]
          },
          {
            type: 'line',
            label: 'Surrender Value (Non guaranteed)',
            backgroundColor: 'rgba(200, 200, 255, 1)',
            pointRadius: 0,
            fill: true,
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
            type: 'line',
            label: 'Total Death Benefit (Guaranteed)',
            backgroundColor: 'rgba(100, 100, 255, 1)',
            pointRadius: 0,
            fill: true,
            data: this.proposalData["Death Benefit (LOW)"]
          },
          {
            type: 'line',
            label: 'Total Death Benefit (Non guaranteed)',
            backgroundColor: 'rgba(200, 200, 255, 1)',
            pointRadius: 0,
            fill: true,
            data: this.proposalData["Death Benefit (" + this.rtn + ")"]//fake formula, it should come from product engine later
          }
        ];
    }
  }
  showSlider(animation) {
    console.log('ani' , animation, animation.animationObject.currentStep)
    if (!this.chart) return;

    let ctx = this.ctx;

    var el = document.getElementById("slider");
    el.style.display = 'block';


    var controller = this.chart.controller;
    var chart = controller.chart;
    var xAxis = controller.scales['x-axis-0'];
    var yAxis = controller.scales['y-axis-0'];


    yAxis.left = 0;

    var numTicks = yAxis.ticks.length;
    var yDiff = yAxis.height / (numTicks - 1);
    var yOffsetStart = yAxis.top;


    ctx.beginPath();
    ctx.strokeStyle = "#CCCCCC";
    ctx.moveTo(yAxis.right + 200, yAxis.top);
    ctx.lineTo(yAxis.right + 200, yAxis.bottom);
    ctx.stroke();



    yAxis.ticks.forEach(function(value, index) {
      if (value == 0) return
      var xOffset = 140;
      var yOffset = yOffsetStart + index * yDiff;//(50 * index) + 60;
      ctx.font = "12px Arial";

      ctx.fillStyle = "#CCCCCC";
      ctx.fillText(value, xOffset, yOffset);
    });
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

  toogleChart() {
    this.chart.config.data.datasets.forEach(function(dataset) {
      dataset.data = dataset.data.map(d=>100);
    });
    this.chart.update();
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
      //this.chart.destroy();
    }

    this.ctx = canvas.getContext("2d");


    this.chart = new Chart(this.ctx, {
      type: 'bar',
      data: chartData,
      options: {
        animation: {
          duration: 1,
          onProgress: this.showSlider,
        },
        scales: {
          xAxes: [{
            stacked: true,
            gridLines: {
              display: false,
            },
            ticks: {
              autoSkip: true,
              maxTicksLimit: 10
            }
          }],
          yAxes: [{
            display: true,
            gridLines: {
              display: true,
              color: 'rgba(212,212,222,1)',
              //drawTicks: false,
            },
            ticks: {
              display: false
            }
          }]
        }
      }
    });

    //this.chart.update();
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
