import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-poc2',
  templateUrl: './poc2.component.html',
  styleUrls: ['./poc2.component.css']
})
export class Poc2Component implements OnInit {
  fa = {
    'A' : 0,
    'B' : 0,
    'C' : 0,
    'D' : 0
  }
  constructor() { }

  ngOnInit() {
  }

}
