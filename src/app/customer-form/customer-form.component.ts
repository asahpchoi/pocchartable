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

  constructor() {
    this.customerObject = {};
    this.customerObjectChange = new EventEmitter<any>();
  }

  sameAsOwner = true;
  email = new FormControl('', [Validators.required, Validators.email]);
  occupation = new FormControl('', [Validators.required]);

  constructor() { }

  ngOnInit() {
  }
  getErrorMessage() {
    return this.email.hasError('required') ? 'You must enter a value' :
        this.email.hasError('email') ? 'Not a valid email' :
            '';
  }

}
