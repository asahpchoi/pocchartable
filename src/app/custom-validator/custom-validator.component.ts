import { Component, OnInit, Input } from '@angular/core';
import { PremiumService } from '../premium.service';

@Component({
  selector: 'app-custom-validator',
  templateUrl: './custom-validator.component.html',
  styleUrls: ['./custom-validator.component.css']
})
export class CustomValidatorComponent implements OnInit {
  @Input()
  field: string;
  errors = [];

  constructor(
    private ps: PremiumService
  ) {
    this.ps.getValidations().subscribe(d => {
      if(d)
        this.errors = d;
    })
  }

  ngOnInit() {
  }

}
