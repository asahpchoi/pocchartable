import {  Component, Input, Output, EventEmitter , OnInit } from '@angular/core';
import {FormControl, Validators} from '@angular/forms';

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

  constructor() {
    this.customerObject = {};
    this.customerObjectChange = new EventEmitter<any>();

    this.customerMaster = {};
    this.customerMasterChange = new EventEmitter<any>();
  }

  email = new FormControl('', [Validators.required, Validators.email]);
  occupation = new FormControl('', [Validators.required]);

  ngOnInit() {
    console.log(this.customerObject)
  }
  getErrorMessage() {
    return this.email.hasError('required') ? 'You must enter a value' :
        this.email.hasError('email') ? 'Not a valid email' :
            '';
  }

}
