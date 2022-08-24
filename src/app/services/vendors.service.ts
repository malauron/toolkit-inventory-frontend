/* eslint-disable id-blacklist */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Vendor } from '../classes/vendor.model';
import { AppParamsConfig } from '../Configurations/app-params.config';

interface ResponseVendors {
  _embedded: {
    vendors: Vendor[];
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
export class VendorsService {
  private apiUrl: string;

  constructor(private http: HttpClient, private config: AppParamsConfig) {}

  getVendors(
    pageNumber?: number,
    pageSize?: number,
    vendorName?: string
  ): Observable<ResponseVendors> {
    if (vendorName === undefined) {
      vendorName = '';
    }

    this.apiUrl = `${this.config.urlVendorSearch}?vendorName=${vendorName}&page=${pageNumber}&size=${pageSize}`;

    return this.http.get<ResponseVendors>(this.apiUrl);
  }
}
