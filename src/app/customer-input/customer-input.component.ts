import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-customer-input',
  templateUrl: './customer-input.component.html',
  styleUrls: ['./customer-input.component.css']
})
export class CustomerInputComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  sameAsOwner = true;
  ocdm = {
    owner: {
      name: 'Peter Yan',
      email: 'peteryan@ocdm.com',
    },
    dependants : [
      {
        name: 'Dependant 1',
        gender: 'M'
      }
    ]
  }

}
