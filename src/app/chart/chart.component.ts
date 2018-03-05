import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { PremiumService } from '../premium.service';


@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit {
  chart;
  raw;
  originds;
  ctx;
  a;
  p;
  sv;
  av;
  selectedIndex;
  maxIndex;
  rtn = 'MEDIUM';
  fm = 125000;
  ps;
  y;
  loading;
  ds;

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

  addMarker(left, top) {
    var img = document.getElementById("marker");
    img.style.top = top + 20 + 'px';
    img.style.left = left + 'px';
    img.style.display = 'block';
  }

  onChartClick(clickEvt: MouseEvent, activeElems: Array<any>) {
    //if click was on a bar, we don't care (we want clicks on labels)
    if (activeElems && activeElems.length) return;

    let mousePoint = Chart.helpers.getRelativePosition(clickEvt, this.chart.chart);

    let xAxis = this.chart.scales['x-axis-0'];
    let clickX = xAxis.getValueForPixel(mousePoint.x);
    this.selectedIndex = clickX;
    let x = (clickX + 0.5) * (xAxis.right - xAxis.left) / xAxis.ticks.length + xAxis.left - 2.5;
    let y = xAxis.top;
    this.addMarker(x, y);
    this.av = this.proposalData.accountValue[clickX];
    this.a = this.proposalData.age[clickX];
    this.p = this.proposalData.premium[clickX];
    this.sv = this.proposalData.surrenderValue[clickX];
    this.y =  this.proposalData.year[clickX];


  }

  loadData() {
    this.loading = true;
    this.ps.getData(this.fm).subscribe(data => {
      this.loading = false;
      this.raw = data;
      this.ds = data.projections[0].columns;
      if(!this.originds) {
        this.originds =   data.projections[0].columns;
      }
      console.log('new data');
      console.log(this.ds);
      console.log('old data');
      console.log(this.originds);
      this.createChart();

    });
  }

  setReturn(rtn) {
    this.rtn = rtn;
    this.createChart();
  }

  createChart() {
    this.proposalData.age = this.ds.filter(x => x.Name == "Age")[0].Values.map(x => x.value);
    this.proposalData.year = this.ds.filter(x => x.Name == "Year")[0].Values.map(x => x.value);


    this.proposalData.premium = this.ds.filter(x => x.Name == "Total Premium")[0].Values.map(x => x.value);
    this.proposalData.origin_premium = this.originds.filter(x => x.Name == "Total Premium")[0].Values.map(x => x.value);
    //this.proposalData.surrenderValue = ds.filter(x => x.Name == "Surrender Value (MEDIUM)")[0].Values.map(x => x.value);
    this.proposalData.accountValue = this.ds.filter(x => x.Name == "Account Value (" + this.rtn + ")")[0].Values.map(x => x.value > 0? x.value: 0);
    this.proposalData.origin_accountValue = this.originds.filter(x => x.Name == "Account Value (" + this.rtn + ")")[0].Values.map(x => x.value > 0? x.value: 0);
    this.maxIndex = this.proposalData.age.length - 1;
    this.selectedIndex = 1;
    var chartData = {
      labels: this.proposalData.age,
      datasets: [{
        type: 'line',
        label: 'Premium Paid',
        borderColor: '#FF0000',
        borderWidth: 2,
        fill: false,
        data: this.proposalData.premium
      }, {
        type: 'line',
        label: 'Origin Premium Paid',
        borderColor: '#FF9999',
        borderWidth: 2,
        fill: false,
        data: this.proposalData.origin_premium
      },{
        type: 'bar',
        label: 'Account Value',
        backgroundColor: 'rgba(255, 0, 0, 0.5)',
        data: this.proposalData.accountValue
      },
      {
        type: 'bar',
        label: 'Origin Account Value',
        backgroundColor: 'rgba(0, 255, 0, 0.5)',
        data: this.proposalData.origin_accountValue
      }
      ,
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
          mode: 'index',
          intersect: true
        },
        scales: {
          xAxes: [
            {
              stacked: true
            }
          ],
          yAxes: [{
            stacked: false,
            ticks : {
              beginAtZero: true
            }
          }]
        },
        onClick: (clickEvt, activeElems) => this.onChartClick(clickEvt, activeElems),
      }
    });
  }
  ngOnInit() {
    this.loadData();
  }

}
