import { Component, OnInit } from '@angular/core';
import { PremiumService } from '../premium.service';
import { ProductService } from '../product.service';
import { CustomerService } from '../customer.service';
import { ValidationService} from '../validation.service'
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';

@Component({
  selector: 'app-product-input',
  templateUrl: './product-input.component.html',
  styleUrls: ['./product-input.component.css']
})
export class ProductInputComponent implements OnInit {
  productInput;
  controls = {
    insuredAgeControl : new FormControl(0, []),
    baseProtectionControl : new FormControl(0, []),
    basePremiumControl : new FormControl(0, [])
  }

  getControls () {
    return Object.keys(this.controls) 
  }

  constructor(
    private premiumSvc: PremiumService,
    private productSvc: ProductService,
    private customerSvc: CustomerService,
    private validationSvc : ValidationService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.productInput = productSvc.productInput;
    if(!this.productInput) {
      this.productInput = {
        fm: 450000,
        age: this.customerSvc.getInsuredAge(),
        plannedPremium: 10000,
        riders: [],
        deathBenefitOption : 'Increase',
        productCode: 'UL007'
      }
    }
    this.validationSvc.getValidationResults().subscribe(
      v => {
        console.log(v)
        if (!v) return
        this.controls.insuredAgeControl = new FormControl(25, [
          Validators.required,
          Validators.min(+v.insuredAge.min),
          Validators.max(+v.insuredAge.max)
        ]);
        this.controls.baseProtectionControl = new FormControl(25, [
          Validators.required,
          Validators.min(+v.faceAmount.min),
          Validators.max(+v.faceAmount.max)
        ]);
        this.controls.basePremiumControl = new FormControl(25, [
          Validators.required,
          Validators.min(+v.premium.min),
          Validators.max(+v.premium.max)
        ]);
      }
    )
    this.loadValidations();
  }
  update() {
    this.productSvc.productInput = this.productInput;
    this.loadData();
    this.router.navigate(['/chart']);
  }
  addRider() {
    this.productInput.riders.push(
      {
        productId: 'ADD03',
        fm: 800000,
        age: 27,
        occupation: 1
      }
    );
  }
  deleteRider(index) {
    this.productInput.riders.splice(index, 1);
  }

  loadData() {
    this.premiumSvc.updateBasic(
      {
        faceAmt: this.productInput.fm,
        age: this.productInput.age,
        plannedPremium: this.productInput.plannedPremium,
        riders: this.productInput.riders,
        deathBenefitOption: this.productInput.deathBenefitOption
      }
    );
    this.premiumSvc.submitProjection();

  }
  ngOnInit() {
      //this.loadData();

  }
  loadValidations() {

    this.validationSvc.loadValidations(
      {
        productCode: this.productInput.productCode,
        insuredAge: this.productInput.age
      }
    );


    /*
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
    */
  }

}
