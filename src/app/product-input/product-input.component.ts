import { Component, OnInit } from '@angular/core';
import { PremiumService } from '../premium.service';
import { ProductService } from '../product.service';
import { CustomerService } from '../customer.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-product-input',
  templateUrl: './product-input.component.html',
  styleUrls: ['./product-input.component.css']
})
export class ProductInputComponent implements OnInit {
  productInput;
  premiumSvc;
  productSvc;
  customerSvc;

  constructor(
    premiumSvc: PremiumService,
    productSvc: ProductService,
    customerSvc: CustomerService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.premiumSvc = premiumSvc;
    this.productSvc = productSvc;
    this.customerSvc = customerSvc;

    this.productInput = productSvc.productInput;
    if(!this.productInput) {
      this.productInput = {
        fm: 200000,
        age: this.customerSvc.getInsuredAge(),
        plannedPremium: 10000,
        riders: []
      }
    }
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
    this.premiumSvc.submit(
      {
        faceAmt: this.productInput.fm,
        age: this.productInput.age,
        plannedPremium: this.productInput.plannedPremium,
        riders: this.productInput.riders
      }
    );

  }
  ngOnInit() {
      this.loadData();
  }

}
