import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.page.html',
  styleUrls: ['./customers.page.scss'],
})
export class CustomersPage implements OnInit {

  isFetching = false;

  constructor(
    private router: Router,
  ) { }

  ngOnInit() {
  }

  onAddCustomer() {
    this.router.navigate(['/', 'tabs', 'customers', 'customer-detail', 0]);
  }

}
