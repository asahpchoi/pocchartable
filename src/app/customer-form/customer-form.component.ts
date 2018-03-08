import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-customer-form',
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.css']
})
export class CustomerFormComponent implements OnInit {
  @Input() customerObject;
  @Output() customerObjectChange: EventEmitter<any>;
  @Input() customerMaster;
  @Output() customerMasterChange: EventEmitter<any>;
  @Input() customerListRef: number[];
  selectCustomerMode = false;

  email = new FormControl('', [Validators.required, Validators.email]);
  occupation = new FormControl('', [Validators.required]);

  constructor() {
    this.customerObject = {};
    this.customerObjectChange = new EventEmitter<any>();
    this.customerMaster = {};
    this.customerMasterChange = new EventEmitter<any>();
    this.customerListRef = [];
  }

  ngOnInit() {
    if (this.customerObject.role == "owner" && !this.customerObject.id) { //load customer fields from customer master if id is not assigned.
      this.customerObject.id = this.customerMaster.customerData.customerId;
      this.customerObject = Object.assign(
        this.customerObject,
        this.loadObject(this.customerMaster.customerData)
      );
    }
    if (this.customerObject.role != "owner" && !this.customerObject.id) { //load customer fields from customer master if id is not assigned.
      this.selectCustomerMode = true;
    }
  }

  assignCustomer(id) {
    this.customerObject.id = id;
    this.customerObject = Object.assign(
      this.customerObject,
      this.loadObject(this.customerMaster.customerData.dependents.filter(x => x.id == id)[0])
    );
    this.selectCustomerMode = false;
  }

  loadObject(refObj) {
    return {
      firstName: refObj.firstName,
      lastName: refObj.lastName,
      email: refObj.email,
      dob: refObj.dob
    }
  }

  loadCustomerList() {
    return this.customerMaster.customerData.dependents.filter(
      d => this.customerListRef.indexOf(d.id) == -1
    )
  }

  getErrorMessage() {
    return this.email.hasError('required') ? 'You must enter a value' :
      this.email.hasError('email') ? 'Not a valid email' :
        '';
  }

}
