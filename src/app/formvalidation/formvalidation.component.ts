import { Component, OnInit } from '@angular/core';
import { PremiumService } from '../premium.service';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';

@Component({
  selector: 'app-formvalidation',
  templateUrl: './formvalidation.component.html',
  styleUrls: ['./formvalidation.component.css'],

})
export class FormvalidationComponent implements OnInit {


  customerObject = {};
  basePremiumControl = new FormControl('', []);
  ageControl = new FormControl('', []);
  faceAmountControl = new FormControl('', []);
  schema = null;

  productInput = {
    faceAmount: 0,
    age: 0,
    basePremium: 0
  }

  constructor(
    private ps: PremiumService
  ) {

  }

  ngOnInit() {
    this.loadValidations();
  }

  loadBasePremium() {
    let mr = this.schema.ProductSchema.FaceAmountMultiplier.MultiplierRecord.filter(
      m => {
        return (
          +m.MaxIssueAge.text >= +this.productInput.age
          &&
          +m.MinIssueAge.text <= +this.productInput.age
        )
      }
    )[0]

    this.productInput.basePremium = +this.productInput.faceAmount / +mr.DefaultFAMultiplier.text;
    this.minBasePremium = +this.productInput.faceAmount / +mr.MaxFAMultiplier.text;
    this.maxBasePremium = +this.productInput.faceAmount / +mr.MinFAMultiplier.text;
    this.basePremiumControl = new FormControl('', [
      Validators.required,
      Validators.min(this.minBasePremium),
      Validators.max(this.maxBasePremium)
    ]);
  }

  loadValidations() {
    this.ps.getproductSchema('UL007').subscribe(

      d => {
        this.schema = d;
        this.ageControl = new FormControl('', [
          Validators.required,
          Validators.min(+d.ProductSchema.BasicParticular.IssueAge.Min.text),
          Validators.max(+d.ProductSchema.BasicParticular.IssueAge.Max.text)
        ]);

        this.faceAmountControl = new FormControl('', [
          Validators.required,
          Validators.min(+d.ProductSchema.BandInformation.BandRecord[0].MinFaceAmount.text),
          Validators.max(+d.ProductSchema.BandInformation.BandRecord[0].MaxFaceAmount.text)
        ]);
      }
    )
  }



  check() {
    ;
    this.ps.updateBasic(
      {
        faceAmt: this.productInput.faceAmount,
        age: this.productInput.age,
        plannedPremium: this.productInput.plannedPremium,
        riders: []
      }
    );
    this.ps.validate();


  }

}
