import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { PremiumService } from '../premium.service';


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
  sliderValues = [0,70];
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
  fm = 200000;
  age = 30;
  ps;
  y;
  loading;
  ds;
  showTable = false;
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

  constructor(ps: PremiumService) {
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

    this.maxIndex = this.proposalData["Age"].length -1;
// /console.log(this.maxIndex)
    this.sliderValues = [0, this.maxIndex];

    var chartData = {
      labels: this.proposalData["Age"],
      datasets: [
        {
          type: 'line',
          label: 'Origin Premium Paid',
          borderColor: '#99FF99',
          borderWidth: 2,
          fill: false,
          data: this.proposalData.origin_premium
        },
        {
          type: 'line',
          label: 'Cumulative Premium Paid',
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
        {
          type: 'bar',
          label: 'Origin Account Value',
          backgroundColor: 'rgba(0, 255, 0, 0.5)',
          data: this.proposalData.origin_accountValue
        },
        {
          type: 'bar',
          label: 'Account Value (Guaranteed)',
          backgroundColor: 'rgba(255, 0, 0, 1)',
          data: this.proposalData["Account Value (" + this.rtn + ")"]
        },
        {
          type: 'bar',
          label: 'Account Value (Non guaranteed)',
          backgroundColor: 'rgba(200, 0, 0, 1)',
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
            topup: t,
            year: i + 1
          }
        }
      ).filter(t => t.topup)
      ,
      withdrawals:
      this.input.withdrawal.map(
        (t, i) => {
          return {
            withdrawal: t,
            year: i + 1
          }
        }
      ).filter(t => t.withdrawal)
    }
  }
  ngOnInit() {
    this.loadData();

  }

}
