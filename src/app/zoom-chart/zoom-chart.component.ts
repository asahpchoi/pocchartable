import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-zoom-chart',
  templateUrl: './zoom-chart.component.html',
  styleUrls: ['./zoom-chart.component.css']
})
export class ZoomChartComponent implements OnInit {
  myChart;

  constructor() { }

  click(e) {
    console.log(this)

  }
  ngOnInit() {
    var ctx = document.getElementById("myChart");
    this.myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
            datasets: [{
                label: '# of Votes',
                data: [12, 19, 3, 5, 2, 3]
            }]
        },
        options: {
            onClick: this.click,
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:true
                    }
                }]
            },
            // Container for pan options
            pan: {
                // Boolean to enable panning
                enabled: true,

                // Panning directions. Remove the appropriate direction to disable
                // Eg. 'y' would only allow panning in the y direction
                mode: 'xy'
            },

            // Container for zoom options
            zoom: {
                // Boolean to enable zooming
                enabled: true,

                // Zooming directions. Remove the appropriate direction to disable
                // Eg. 'y' would only allow zooming in the y direction
                mode: 'xy',
            }
        }
    });
  }




}
