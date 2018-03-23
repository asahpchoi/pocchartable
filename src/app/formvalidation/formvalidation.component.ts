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
  plannedPremiumControl = new FormControl(0, []);
  schema;
  termRiderCode = 'TRI07';
  defaultRiders = [
    {
      riderCode: 'ADD03',
      faceAmount: 150000
    }
  ]


  productInput = {
    faceAmount: 0,
    age: 25,
    basePremium: 0,
    termFaceAmount: 0,
    termPremium: 0,
    plannedPremium: 0,
    riderPremium: 35000,
    language: 'en'
  }

  constructor(
    private ps: PremiumService
  ) {

  }

  ngOnInit() {
    this.loadValidations();
  }

  updateTermPermium() {
    this.ps.submitValidation().subscribe(err => {
      console.log(err)
      if(err == 0) {
        console.log('DONE', err)
        this.getPremium();
        this.ps.getPremiumResult().subscribe(p => {
          if (!p) return;
          let termPremium = p.riders.filter(r => r.riderCode == this.termRiderCode)[0].
            premiums.premiums.filter(p => p.paymentMode == 'Annual')[0].
            premium;

          this.productInput.termPremium = +termPremium;
          let rs = p.riders.filter(r => r.riderCode != this.termRiderCode).map(
            r => r.premiums.premiums.filter(p => p.paymentMode == 'Annual')[0].premium
          )
          this.productInput.riderPremium = (rs.reduce((r, p)=> r + p, 0))
          this.updatePlannedPremium();
        });
      }
    })
  }

  updatePlannedPremium() {
    this.productInput.plannedPremium =
      +this.productInput.termPremium +
      +this.productInput.riderPremium +
      +this.productInput.basePremium;
  }

  getTopup() {
    let topup = this.productInput.plannedPremium -
      this.productInput.riderPremium -
      this.productInput.termPremium -
      this.productInput.basePremium;

    return topup >= 0 ? topup : 'N/A'
  }

  getPremium() {
    this.ps.updateBasic(
      {
        faceAmt: this.productInput.faceAmount,
        age: this.productInput.age,
        plannedPremium: this.productInput.plannedPremium,
        language: this.productInput.language,
        riders: [
          {
            faceAmount: this.productInput.termFaceAmount,
            age: this.productInput.age,
            productId: this.termRiderCode
          },
          ...this.defaultRiders.map(
            r => {
              return {
                faceAmount: r.faceAmount,
                age: 20,
                productId: r.riderCode,
                occupation: 1
              }
            }
          )
        ]
      }
    );
    this.ps.submitPremiumCalculation();
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

    if (mr) {
      this.productInput.basePremium = +this.productInput.faceAmount / +mr.DefaultFAMultiplier.text;
      this.minBasePremium = +this.productInput.faceAmount / +mr.MaxFAMultiplier.text;
      this.maxBasePremium = +this.productInput.faceAmount / +mr.MinFAMultiplier.text;
      this.basePremiumControl = new FormControl(0, [
        Validators.required,
        Validators.min(this.minBasePremium),
        Validators.max(this.maxBasePremium)
      ]);
      this.plannedPremiumControl = new FormControl(0, [
        Validators.required,
        Validators.min(
          +this.productInput.riderPremium +
          +this.productInput.termPremium +
          +this.productInput.basePremium
        )
      ]);
    }
  }

  loadValidations() {
    this.ps.getproductSchema('UL007').subscribe(

      d => {
        this.schema = d;
        let schema: any = d;
        this.ageControl = new FormControl(25, [
          Validators.required,
          Validators.min(+schema.ProductSchema.BasicParticular.IssueAge.Min.text),
          Validators.max(+schema.ProductSchema.BasicParticular.IssueAge.Max.text)
        ]);

        this.faceAmountControl = new FormControl(0, [
          Validators.required,
          Validators.min(+schema.ProductSchema.BandInformation.BandRecord[0].MinFaceAmount.text),
          Validators.max(+schema.ProductSchema.BandInformation.BandRecord[0].MaxFaceAmount.text)
        ]);
      }
    )
  }

  check() {
    this.ps.submitValidation();
  }
}
