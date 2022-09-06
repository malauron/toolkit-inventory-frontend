/* eslint-disable max-len */
/* eslint-disable no-underscore-dangle */
/* eslint-disable id-blacklist */
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { CustomerDto } from '../classes/customer-dto.model';
import { Customer } from '../classes/customer.model';
import { AppParamsConfig } from '../Configurations/app-params.config';

interface ResponseCustomers {
  _embedded: {
    customers: Customer[];
  };
  page: {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
  };
}

@Injectable({
  providedIn: 'root',
})
export class CustomersService {
  private apiUrl: string;

  private _customersHaveChanged = new Subject<boolean>();

  constructor(private http: HttpClient, private config: AppParamsConfig) {}

  get customersHaveChanged() {
    return this._customersHaveChanged;
  }

  getCustomer(customerId: number): Observable<Customer> {

    this.apiUrl = `${this.config.urlCustomers}/${customerId}?projection=customerSingleView`;
    return this.http.get<Customer>(this.apiUrl);

  }

  getCustomers(
    pageNumber?: number,
    pageSize?: number,
    customerName?: string
  ): Observable<ResponseCustomers> {
    if (customerName === undefined) {
      this.apiUrl = `${this.config.urlCustomers}?page=${pageNumber}&size=${pageSize}`;
    } else {
      this.apiUrl = `${this.config.urlCustomerSearch}?customerName=${customerName}&page=${pageNumber}&size=${pageSize}`;
    }

    return this.http.get<ResponseCustomers>(this.apiUrl);
  }

  getCustomersByNameOrId(
    pageNumber?: number,
    pageSize?: number,
    searchDesc?: any
  ): Observable<ResponseCustomers> {
    if (searchDesc === undefined) {
      searchDesc = '';
    }

    let id: number;
    const purchaseStatus = ['Unposted'];

    if (isNaN(searchDesc)) {
      id = 0;
    } else {
      id = searchDesc;
    }

    searchDesc = String(searchDesc).replace('%', '');
    searchDesc = String(searchDesc).replace('^', '');
    searchDesc = String(searchDesc).replace('[', '');
    searchDesc = String(searchDesc).replace(']', '');
    searchDesc = String(searchDesc).replace('|', '');
    searchDesc = String(searchDesc).replace('\\', '');

    this.apiUrl =
      `${this.config.urlCustomerFindByNameOrId}?customerId=${id}&customerName=${searchDesc}` +
      `&page=${pageNumber}&size=${pageSize}&projection=customerPageView`;

    return this.http.get<ResponseCustomers>(this.apiUrl);
  }

  postCustomer(customerData: FormData) {
    this.apiUrl = `${this.config.urlV1Customers}`;
    return this.http.put<number>(this.apiUrl, customerData);
  }
}
