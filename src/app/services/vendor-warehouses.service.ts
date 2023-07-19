/* eslint-disable id-blacklist */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { VendorWarehouse } from '../classes/vendor-warehouse.model';
import { AppParamsConfig } from '../Configurations/app-params.config';

interface ResponseWarehouses {
  _embedded: {
    vendorWarehouses: VendorWarehouse[];
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

export class VendorWarehousesService {

  urlVendorWarehouse;
  urlVendorWarehouseSearchById;
  urlVendorWarehouseSearch;

  private apiUrl: string;

  constructor(private http: HttpClient, private config: AppParamsConfig) {
    this.urlVendorWarehouse = `${this.config.url}/vendorWarehouses`;
    this.urlVendorWarehouseSearchById = `${this.urlVendorWarehouse}/search/findByVendorWarehouseId?id=`;
    this.urlVendorWarehouseSearch = `${this.urlVendorWarehouse}/search/findByVendorWarehouseNameContainingOrderByVendorWarehouseName`;
  }

  getWarehouseById(id: number): Observable<VendorWarehouse> {
    this.apiUrl = `${this.urlVendorWarehouseSearchById}${id}`;
    return this.http.get<VendorWarehouse>(this.apiUrl);
  }

  getWarehouses(
    pageNumber?: number,
    pageSize?: number,
    warehouseName?: string
  ): Observable<ResponseWarehouses> {
    if (warehouseName === undefined) {
      warehouseName = '';
    }

    this.apiUrl = `${this.urlVendorWarehouseSearch}?vendorWarehouseName=${warehouseName}&page=${pageNumber}&size=${pageSize}`;

    return this.http.get<ResponseWarehouses>(this.apiUrl);
  }

}
