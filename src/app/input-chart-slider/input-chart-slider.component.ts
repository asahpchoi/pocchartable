import { Component, OnInit, ViewChild, Input, ElementRef} from '@angular/core';
import * as _ from 'lodash';

@Component({
  selector: 'app-input-chart-slider',
  templateUrl: './input-chart-slider.component.html',
  styleUrls: ['./input-chart-slider.component.scss']
})
export class InputChartSliderComponent implements OnInit {
  @ViewChild('sliderValue') private sliderValue;
  @ViewChild('slideMaxValue') private slideMaxValue;
  @Input() ngModel;

  private matSliderStyle = {};
  private trackStyle = {};
  private matSliderThumbWidth = 16;
  private min = 0;
  private max = 0;
  private step = 1;

  constructor(
    private element: ElementRef,
  ) { }

  ngOnInit() {
  }

  ngOnChanges(changes){
    if (this.ngModel==undefined) return;
    if (this.ngModel.chart==undefined) return;

    let xAxisBox = this.ngModel.chart.scales["x-axis-0"];
    let offsetWidth = xAxisBox.width;
    this.element.nativeElement.style.width = `${offsetWidth}px`;
    // + this.ngModel.chart.ctx.lineWidth/2
    this.element.nativeElement.style.left = `${xAxisBox.left + this.ngModel.chart.canvas.offsetLeft}px`;
    this.element.nativeElement.style.top = `${this.ngModel.chart.chartArea.bottom + this.ngModel.chart.canvas.offsetTop}px`;
    
    this.min = xAxisBox.min;
    this.max = xAxisBox.max;
    this.step = ((this.max-1)-(this.min-1))/xAxisBox.maxIndex;

    let tickWidth = offsetWidth/(xAxisBox.ticks.length);
    this.matSliderStyle = {
      left: `${(tickWidth - this.matSliderThumbWidth)/2}px`,
      width: `${offsetWidth - (tickWidth-this.matSliderThumbWidth)}px`,
    };
    this.trackStyle = {
      width: `${offsetWidth}px`,
    };
  }

  sliderValue_touchmove(event){
    this.ngModel.value = this.sliderValue.value;
  }

  slideMaxValue_touchmove(event){
    this.ngModel.maxValue = this.slideMaxValue.value;
  }
}
