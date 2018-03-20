import { Component, OnInit } from '@angular/core';
import { PremiumService } from '../premium.service';

@Component({
  selector: 'app-formvalidation',
  templateUrl: './formvalidation.component.html',
  styleUrls: ['./formvalidation.component.css'],

})
export class FormvalidationComponent implements OnInit {
 

  customerObject = {};

  productInput = {
    fm: 0,
    age: 0,
    plannedPremium: 0
  }

  constructor(
    private ps: PremiumService
  ) {

  }

  ngOnInit() {

  }

  check() {
    this.ps.updateBasic(
      {
        faceAmt: this.productInput.fm,
        age: this.productInput.age,
        plannedPremium: this.productInput.plannedPremium,
        riders: []
      }
    );
    this.ps.validate();


  }

}
