import { Component, OnInit } from '@angular/core';
import { Customer } from 'src/app/classes/customer.model';

@Component({
  selector: 'app-customer-detail',
  templateUrl: './customer-detail.page.html',
  styleUrls: ['./customer-detail.page.scss'],
})
export class CustomerDetailPage implements OnInit {

  customer = new Customer();

  isFetching = false;

  constructor() { }

  ngOnInit() {
  }

  onSaveCustomer(){}
}
