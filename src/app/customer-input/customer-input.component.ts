import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../customer.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';


@Component({
  selector: 'app-customer-input',
  templateUrl: './customer-input.component.html',
  styleUrls: ['./customer-input.component.css']
})
export class CustomerInputComponent implements OnInit {
  customerSvc;
  customerMaster;
  customers;

  constructor(
    customerSvc: CustomerService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.customerSvc = customerSvc;
    if(this.customerSvc.customers) {
      this.customers = this.customerSvc.customers;
      this.customerMaster = this.customerSvc.customerMaster;
    }
  }

  ngOnInit() {
  }

  save() {
    this.customerSvc.customers = this.customers;
    this.router.navigate(['/']);
  }

  addDependent() {
    this.customers.dependents.push(
      {}
    );
  }

  getBindedId() {
    let depends = this.customers.dependents.map(
      d => d.id
    );
    if(this.customers.insured.id) {
      depends.push(this.customers.insured.id);
    }
    return depends;
  }

  changeIsInsured() {
      this.customers.insured = {
        role: 'insured',
        id: null
      }
  }
}
