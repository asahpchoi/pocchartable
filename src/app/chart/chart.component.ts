import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { PremiumService } from '../premium.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { TopupInputComponent } from '../topup-input/topup-input.component';
import { InputChartSliderComponent } from '../input-chart-slider/input-chart-slider.component';


@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit {
  avaliableFields = [`Total Death Benefit ($rtn)`, 'Premium Load', `COI ($rtn)`, `Loyalty Bonus ($rtn)`, 'Total Premium'];
  fullTableFields = ['Account Value ($rtn)', 'Surrender Value ($rtn)', 'Death Benefit ($rtn)']
  legend = {
    figure1:0,
    figure2:0
  };
  originalDataSet = [];
  switched = true;

  input = {
    topup: [],
    withdrawal: []
  }
  ui = {
    sliderValues: [0, 70],
    isLoading: true,
    step: 1
  }
  originalProposalData;
  chart;
  ctx: CanvasRenderingContext2D;

  maxIndex = 100;
  rtn = 'LOW';
  tableData = [];
  ds;
  showTable = false;
  defaultColumns = ['Year', 'Age', "Account Value (" + this.rtn + ")"]
  selectedView = 'AV';
  error;


  OptionalFields = [];
  proposalData = {
  };

  viewDataSet;

  constructor(
    private premiumSvc: PremiumService,
    public dialog: MatDialog
  ) {
    this.loadData();
  }

  getLapsed() {
    this.chart.lapsed = {
      LOW: 0,
      MEDIUM: 0,
      HIGH: 0
    }
    let rtns = ["LOW", "MEDIUM", "HIGH"];
    rtns.forEach(r => {

      let ls = this.proposalData["Lapse (" + r + ")"].filter(
        l => l == "N"
      )
      if(this.proposalData["Lapse (" + r + ")"].length == ls.length) return 0;      
      this.chart.lapsed[r] = ls.length - 1;

      //return ls.length;
      //if(ls.length == 0) return 0;
      //return ls[0].year;
    });
  }
  submitfundActivity() {
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
    console.log('fundActs', fundActs);
    this.premiumSvc.updateFundActivities(fundActs.filter(x => x));
    this.premiumSvc.submitProjection();
    this.createChart();
  }
  updateView() {
    if (this.selectedView == 'AV') {
      this.viewDataSet =
        [
          {
            type: 'line',
            label: "Total Premium",
            borderColor: '#2081F2',
            borderWidth: 2,
            pointRadius: 0,
            fill: false,
            data: this.proposalData["Total Premium"]
          },
          {
            type: 'line',
            label: 'Account Value (LOW)',
            backgroundColor: '#4ADB9D',
            borderColor: '#00BF66',
            pointRadius: 0,
            fill: true,
            data: this.proposalData["Account Value (LOW)"]
          },
          {
            type: 'line',
            label: "Account Value (" + this.rtn + ")",
            backgroundColor: '#4ADB9D',
            borderColor: '#00BF66',
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
            backgroundColor: '#4ADB9D',
            borderColor: '#00BF66',
            pointRadius: 0,
            fill: true,
            data: this.proposalData["Surrender Value (LOW)"]
          },
          {
            type: 'line',
            label: 'Surrender Value (Non guaranteed)',
            backgroundColor: '#4ADB9D',
            borderColor: '#00BF66',
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
            backgroundColor: '#4ADB9D',
            borderColor: '#00BF66',
            pointRadius: 0,
            fill: true,
            data: this.proposalData["Death Benefit (LOW)"]
          },
          {
            type: 'line',
            label: 'Total Death Benefit (Non guaranteed)',
            backgroundColor: '#4ADB9D',
            borderColor: '#00BF66',
            pointRadius: 0,
            fill: true,
            data: this.proposalData["Death Benefit (" + this.rtn + ")"]//fake formula, it should come from product engine later
          }
        ];
    }
  }
  modifyChart(animation) {
    if (!this.chart) return;
    let ctx = this.ctx;

    var controller = this.chart.controller;



    var chart = controller.chart;
    var xAxis = controller.scales['x-axis-0'];
    var yAxis = controller.scales['y-axis-0'];

    var el = document.getElementById("slider1");
    var el2 = document.getElementById("slider2");
    var toogle = document.getElementById("toogle");
    el.style.display = 'block';
    el.style.top = yAxis.bottom + 55 + 'px';
    el.style.left = xAxis.left + 'px';
    el.style.width = xAxis.width + 'px';
    el2.style.display = 'block';
    el2.style.top = yAxis.bottom + 55 + 'px';
    el2.style.left = xAxis.left + 'px';
    el2.style.width = xAxis.width + 'px';

    toogle.style.top = yAxis.top + 100 + 'px';
    toogle.style.left = xAxis.right - 100 + 'px';
    toogle.style.display = 'block';


    var numTicks = yAxis.ticks.length;
    var yDiff = yAxis.height / (numTicks - 1);
    var xDiff = xAxis.width / (xAxis.ticks.length - 1);

    var yOffsetStart = yAxis.top + 8;

    let currformatter = new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    });

    let formatter = new Intl.NumberFormat('vi-VN', {
      minimumFractionDigits: 0,
    });

    var xOffset = 30;
    ctx.font = "10px";
    ctx.fillStyle = "#888888"
    ctx.fillText(currformatter.format(1000), xOffset, yOffsetStart + 10);

    ctx.font = "15px";
    yAxis.ticks.forEach(function(value, index) {
      if (value < 200000) return;
      if (index == 0) return;
      var yOffset = yOffsetStart + index * yDiff;

      ctx.fillText(formatter.format(value), xOffset, yOffset);
    });

    if (this.chart.lapsed[this.rtn] > 0) {
      let x = (this.chart.lapsed[this.rtn] + 1) * xDiff;
      ctx.beginPath();
      ctx.strokeStyle = "#FF0000";
      ctx.setLineDash([5, 5]);
      ctx.moveTo(x, yAxis.top);
      ctx.lineTo(x, yAxis.bottom);
      ctx.stroke();
    }
  }

  showLegend(index) {
    if (index == -1) {
      document.getElementById("legend").style.display = 'none';
    } else {
      document.getElementById("legend").style.display = 'block';
      this.updateLegend(index - 1);
    }
  }

  onInputChange(event: any) {
    this.updateLegend(event.value);
  }

  updateLegend(i) {
    this.legend.figure1 = this.proposalData["Total Premium"][i]
    this.legend.figure2 = this.proposalData["Account Value (" + this.rtn + ")"][i]


    var controller = this.chart.controller;
    var chart = controller.chart;
    var xAxis = controller.scales['x-axis-0'];
    document.getElementById("legend").style.top = xAxis.top - 80 + 'px'
    document.getElementById("legend").style.left = xAxis.left + xAxis.width / xAxis.ticks.length * i * 0.8 + 'px';
  }

  loadData() {
    console.log('loadData')
    this.ui.isLoading = true;
    this.premiumSvc.getProjectionResult().subscribe(data => {
      if (data) {
        this.ui.isLoading = false;
        this.ds = data.projections[0].columns;
        this.error = data.projections["0"].validationResult;
        this.createChart();
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

  openDialog(object, key, index): void {
    console.log('old object', object)
    let dialogRef = this.dialog.open(TopupInputComponent, {
      width: '300px',
      data: {
        startYear: index,
        object: object,
        key: key,
        startAge: this.proposalData['Age'][index]
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(!result) return;
      for (var i = 0; i < result.duration; i++) {
        object[key][index + i] = result.value;
      }
      this.submitfundActivity();
      this.createChart()
    });
  }

  toogleChart() {
    let selectDataSet = this.switched ? this.originalProposalData : this.proposalData;
    this.switched = !this.switched;

    this.chart.config.data.datasets.forEach(function(dataset) {
      dataset.data = selectDataSet[dataset.label]
    });
    this.chart.update();
  }

  createChart() {
    //('create chart');
    let fields = this.ds.map(x => x.Name)
    fields.forEach(
      f => {
        this.proposalData[f] = this.ds.filter(x => x.Name == f)[0].Values.map(x => x.value);// > 0 ? x.value : 0);
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
    if(!this.originalProposalData) {
      this.originalProposalData = Object.assign({}, this.proposalData);
    }

    this.maxIndex = this.proposalData["Age"].length - 1;
    this.ui.sliderValues = [0, this.maxIndex];

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

    this.ctx = canvas.getContext("2d");

    let yGrid = this.proposalData["Age"].map(
      a => a % 10 ? '#FAFAFA' : 'rgba(212,212,222,1)'
    )

    this.chart = new Chart(this.ctx, {
      type: 'bar',
      data: chartData,
      maintainAspectRatio: true,
      options: {
        legend: {
          display: false
        },
        tooltips: {
          enabled: false
        },
        animation: {
          onProgress: this.modifyChart,
        },
        scales: {
          xAxes: [{
            gridLines: {
              drawBorder: false,
              color: yGrid
            },
            stacked: true,
            ticks: {
              fontSize: 20,
              autoSkip: false,
              callback: function(tick, index, ticks) {
                return (tick % 10 == 0 || index == 0 || index == ticks.length - 1) ? tick : "";
              },
              maxRotation: 0 // angle in degrees
            }
          }],
          yAxes: [{
            display: true,
            gridLines: {
              display: true,
              color: 'rgba(212,212,222,1)',
              zeroLineColor: '#000000'
            },
            ticks: {
              display: false
            }
          }]
        }
      }
    });
    this.getLapsed();
    this.chart.rtn = this.rtn;
  }

  isLapsed(i) {
    if (!this.chart) return false;
    let lapsedYear = this.chart.lapsed[this.rtn];
    return lapsedYear > 0 && lapsedYear <= i;
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
