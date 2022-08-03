/* eslint-disable no-underscore-dangle */
import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSearchbar, ModalController, ViewDidEnter } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { Customer } from 'src/app/classes/customer.model';
import { ConfigParam } from 'src/app/ConfigParam';
import { CustomersService } from 'src/app/services/customers.service';


@Component({
  selector: 'app-customer-search',
  templateUrl: './customer-search.component.html',
  styleUrls: ['./customer-search.component.scss'],
})
export class CustomerSearchComponent implements OnInit, ViewDidEnter {
  @ViewChild('infiniteScroll') infiniteScroll;
  @ViewChild('customerSearchBar', {static: true}) customerSearchBar: IonSearchbar;

  customerSearchBarSubscription: Subscription;

  customerList: Customer[] = [];

  searchValue = '';

  pageNumber = 0;
  totalPages = 0;

  isFetching = false;

  constructor(
    private customerService: CustomersService,
    private config: ConfigParam,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.customerSearchBarSubscription = this.customerSearchBar.ionInput
      .pipe(
        map((event) => (event.target as HTMLInputElement).value),
        debounceTime(2000),
        distinctUntilChanged()
      )
      .subscribe((res) => {
        this.searchValue = res.trim();
        this.infiniteScroll.disabled = false;
        this.customerList = [];
        this.pageNumber = 0;
        this.totalPages = 0;
        if (this.searchValue) {
          this.getCustomers(undefined, 0, this.config.pageSize, this.searchValue);
        } else {
          this.getCustomers(undefined, 0, this.config.pageSize);
        }
      });
  }

  ionViewDidEnter(): void {
      setTimeout(() => {
        this.customerSearchBar.setFocus();
      }, 5);
  }

  getCustomers(
    event?,
    pageNumber?: number,
    pageSize?: number,
    customerName?: string
  ) {
    this.isFetching = true;

    if (customerName === undefined) {
      this.customerService
        .getCustomers(pageNumber, pageSize)
        .subscribe(this.procressResult(event), (error) => {
          this.isFetching = false;
        });
    } else {
      this.customerService
        .getCustomers(pageNumber, pageSize, customerName)
        .subscribe(this.procressResult(event), (error) => {
          this.isFetching = false;
        });
    }
  }

  procressResult(event?) {
    return(data) => {
      this.customerList = this.customerList.concat(data._embedded.customers);
      this.totalPages = data.page.totalPages;
      this.isFetching = false;
      if (event) {
        event.target.complete();
      }
    };
  }

  loadMoreCustomers(event) {
    if (this.pageNumber + 1 >= this.totalPages) {
      event.target.disabled = true;
      return;
    }

    this.pageNumber++;

    if (this.searchValue) {
      this.getCustomers(
        event,
        this.pageNumber,
        this.config.pageSize,
        this.searchValue
      );
    } else {
      this.getCustomers(event, this.pageNumber, this.config.pageSize);
    }
  }

  dismissModal() {
    this.modalController.dismiss(null, 'dismissModal');
  }

  onSelectCustomer(customer: Customer) {
    this.modalController.dismiss(customer, 'customer');
  }
}
