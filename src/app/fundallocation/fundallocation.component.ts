import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-fundallocation',
  templateUrl: './fundallocation.component.html',
  styleUrls: ['./fundallocation.component.css']
})
export class FundallocationComponent implements OnInit {
  @Input()
  functionAllocations

  @Output()
  functionAllocationsChange = new EventEmitter();

  fundKeys() {
    return Object.keys(this.functionAllocations);    
  }
  onInputChange(event: any) {

    let ctrl = event.source._elementRef.nativeElement;
    let total = Object.keys(this.functionAllocations).filter(k => (k != ctrl.id)).reduce(
      (p, c) => {
        return this.functionAllocations[c] + p
      }, 0
    )
    if(total + event.source.value > 100) {
      event.source.value = 100 - total;
      this.functionAllocations[ctrl.id] = 100 - total;
    }
    if (event.source.value < 10 && event.source.value != 0) {
      if(10 + total <= 100) {
        event.source.value = 10;
        this.functionAllocations[ctrl.id] = 10;
      }
      else {
        event.source.value = 0;
        this.functionAllocations[ctrl.id] = 0;
      }
    }

  }
  constructor() { }

  ngOnInit() {
  }

}
