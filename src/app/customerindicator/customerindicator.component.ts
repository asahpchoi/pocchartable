import { Component, OnInit } from '@angular/core';
import { PremiumService } from '../premium.service';

@Component({
  selector: 'app-customerindicator',
  templateUrl: './customerindicator.component.html',
  styleUrls: ['./customerindicator.component.css']
})
export class CustomerindicatorComponent implements OnInit {
  updated = false;
  errors;
  constructor(
    private ps: PremiumService
  ) {
    this.ps.getValidationResult().subscribe(d => {
      if(d) {
        this.errors = d;
        this.updated = false;
        if(this.errors['%INSURED%']) {
          this.updated = true;
        }

      }


    })
  }

  ngOnInit() {
  }

}
