/* eslint-disable no-underscore-dangle */
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonSearchbar, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { Customer } from '../classes/customer.model';
import { AppParamsConfig } from '../Configurations/app-params.config';
import { CustomersService } from '../services/customers.service';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.page.html',
  styleUrls: ['./customers.page.scss'],
})
export class CustomersPage implements OnInit, OnDestroy {
  @ViewChild('infiniteScroll') infiniteScroll;
  @ViewChild('customerSearchBar', { static: true })
  customerSearchBar: IonSearchbar;

  customerSearchBarSub: Subscription;
  customerSub: Subscription;

  customers: Customer[];

  searchValue = '';

  pageNumber = 0;
  totalPages = 0;

  isFetching = false;

  constructor(
    private customerService: CustomersService,
    private router: Router,
    private config: AppParamsConfig,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.customers = [];

    this.customerSearchBarSub = this.customerSearchBar.ionInput
      .pipe(
        map((event) => (event.target as HTMLInputElement).value),
        debounceTime(this.config.waitTime),
        distinctUntilChanged()
      )
      .subscribe((res) => {
        this.searchValue = res.trim();
        this.infiniteScroll.disabled = false;
        this.customers = [];
        this.pageNumber = 0;
        this.totalPages = 0;
        this.getCustomers(undefined, 0, this.config.pageSize, this.searchValue);
      });

    // Retrieves a new set of data from the server
    // after adding or updating
    this.customerSub = this.customerService.customersHaveChanged.subscribe(
      (data) => {
        this.searchValue = '';
        this.infiniteScroll.disabled = false;
        this.customers = [];
        this.pageNumber = 0;
        this.totalPages = 0;
        this.getCustomers(undefined, 0, this.config.pageSize);
      }
    );

    // Retrieves a partial list from the server
    // upon component initialization
    this.getCustomers(undefined, 0, this.config.pageSize);
  }

  onAddCustomer() {
    this.router.navigate(['/', 'tabs', 'customers', 'customer-detail', 0]);
  }

  onEditCustomer(customerId: number) {
    this.router.navigate(['/','tabs','customers','customer-detail', customerId]);
  }

  getCustomers(
    event?,
    pageNumber?: number,
    pageSize?: number,
    searchDesc?: string
  ) {
    this.isFetching = true;

    if (searchDesc === undefined) {
      searchDesc = '';
    }
    this.customerService
      .getCustomersByNameOrId(pageNumber, pageSize, searchDesc)
      .subscribe(this.processPurchaseResult(event), (error) => {
        this.messageBox('Unable to communicate with the server.');
      });
  }

  processPurchaseResult(event?) {
    return (data) => {

      for (const key in data._embedded.customers) {
        if (data._embedded.customers.hasOwnProperty(key)) {
          const newCustomer = new Customer();

          newCustomer.customerId = data._embedded.customers[key].customerId;
          newCustomer.customerName = data._embedded.customers[key].customerName;
          if (data._embedded.customers[key].customerPicture) {
            newCustomer.convertedPicture =
              'data:' + data._embedded.customers[key].customerPicture.type +
              ';base64,' + data._embedded.customers[key].customerPicture.file;
          } else {
            newCustomer.convertedPicture = '../../assets/icons/personv06.svg';
          }
          this.customers.push(newCustomer);
        }
      }

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

  async messageBox(messageDescription: string) {
    const toast = await this.toastController.create({
      color: 'dark',
      duration: 2000,
      position: 'top',
      message: messageDescription,
    });
    await toast.present();
  }

  ngOnDestroy(): void {
    this.customerSearchBarSub.unsubscribe();
    this.customerSub.unsubscribe();
  }
}
