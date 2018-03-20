import { Component, OnInit } from '@angular/core';
import { PremiumService } from '../premium.service';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';

@Component({
  selector: 'app-formvalidation',
  templateUrl: './formvalidation.component.html',
  styleUrls: ['./formvalidation.component.css'],

})
export class FormvalidationComponent implements OnInit {

  minBasePremium;
  maxBasePremium;
  basePremiumControl = new FormControl(0, []);
  ageControl = new FormControl(25, []);
  faceAmountControl = new FormControl(0, []);
  schema;


  productInput = {
    faceAmount: 0,
    age: 25,
    basePremium: 0,
    termFaceAmount: 0,
    termPremium: 0,
    plannedPremium: 0,
    riderPremium: 35000
  }

  constructor(
    private ps: PremiumService
  ) {

  }

  ngOnInit() {
    this.loadValidations();
  }

  updateTermPermium() {
    console.log('d')
    this.productInput.termPremium = this.productInput.termFaceAmount / 10;
    this.updatePlannedPremium()
  }

  updatePlannedPremium() {
    this.productInput.plannedPremium = this.productInput.termPremium +
    this.productInput.riderPremium +
    this.productInput.basePremium
  }
  loadBasePremium() {
    let schema: any = this.schema;
    let mr = schema.ProductSchema.FaceAmountMultiplier.MultiplierRecord.filter(
      m => {
        return (
          +m.MaxIssueAge.text >= +this.productInput.age
          &&
          +m.MinIssueAge.text <= +this.productInput.age
        )
      }
    )[0];

    if(mr) {

      this.productInput.basePremium = +this.productInput.faceAmount / +mr.DefaultFAMultiplier.text;
      this.minBasePremium = +this.productInput.faceAmount / +mr.MaxFAMultiplier.text;
      this.maxBasePremium = +this.productInput.faceAmount / +mr.MinFAMultiplier.text;
      this.basePremiumControl = new FormControl('', [
        Validators.required,
        Validators.min(this.minBasePremium),
        Validators.max(this.maxBasePremium)
      ]);
    }
  }

  loadValidations() {
    this.ps.getproductSchema('UL007').subscribe(

      d => {
        this.schema = d;
        let schema : any = d;
        this.ageControl = new FormControl('', [
          Validators.required,
          Validators.min(+schema.ProductSchema.BasicParticular.IssueAge.Min.text),
          Validators.max(+schema.ProductSchema.BasicParticular.IssueAge.Max.text)
        ]);

        this.faceAmountControl = new FormControl('', [
          Validators.required,
          Validators.min(+schema.ProductSchema.BandInformation.BandRecord[0].MinFaceAmount.text),
          Validators.max(+schema.ProductSchema.BandInformation.BandRecord[0].MaxFaceAmount.text)
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
