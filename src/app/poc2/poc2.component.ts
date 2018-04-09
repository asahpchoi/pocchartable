import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-poc2',
  templateUrl: './poc2.component.html',
  styleUrls: ['./poc2.component.css']
})
export class Poc2Component implements OnInit {
  fa = {
    'AF' : 0,
    'GF' : 0,
    'BF' : 0,
    'DF' : 0,
    'FIF' : 0,
    'MMF' : 0,
  }
  constructor() { }

  ngOnInit() {
  }

}
