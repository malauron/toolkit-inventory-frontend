/* eslint-disable id-blacklist */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Customer } from '../classes/customer.model';
import { ConfigParam } from '../ConfigParam';

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

  // private _item = new Subject<Customer>();

  constructor(
    private http: HttpClient,
    private config: ConfigParam
  ){}

  getCustomers(
    pageNumber?: number,
    pageSize?: number,
    customerName?: string
  ): Observable<ResponseCustomers>{
    if (customerName === undefined) {
      this.apiUrl = `${this.config.urlCustomers}?page=${pageNumber}&size=${pageSize}`;
    } else {
      this.apiUrl = `${this.config.urlCustomerSearch}?customerName=${customerName}&page=${pageNumber}&size=${pageSize}`;
    }

    return this.http.get<ResponseCustomers>(this.apiUrl);
  }

}