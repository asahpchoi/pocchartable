import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { CustomerService } from '../customer.service';
@Component({
  selector: 'app-customer-view',
  templateUrl: './customer-view.component.html',
  styleUrls: ['./customer-view.component.css']
})
export class CustomerViewComponent implements OnInit {
  customers;
  
  constructor(    private route: ActivatedRoute,
      private router: Router,
      private customerSvc: CustomerService
    ) {
      this.customers = customerSvc.customers;
    }

  ngOnInit() {
  }

  edit() {
    this.router.navigate(['/customerForm']);
  }

}
