import { Injectable } from '@angular/core';

@Injectable()
export class CustomerService {
  public customers;

  constructor() { }

  getInsuredAge() {
    if (this.customers) {
      if (this.customers.owner.isInsured) {
        return this.customers.owner.age;
      }
      else {
        return this.customers.insured.age;
      }
    }
    else {
      return 30; //
    }
  }
}
