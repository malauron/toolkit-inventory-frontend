/* eslint-disable id-blacklist */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Warehouse } from '../classes/warehouse.model';
import { AppParamsConfig } from '../Configurations/app-params.config';


interface ResponseWarehouses {
  _embedded: {
    warehouses: Warehouse[];
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

export class WarehousesService {
  private apiUrl: string;

  constructor(private http: HttpClient, private config: AppParamsConfig) {}

  getWarehouses(
    pageNumber?: number,
    pageSize?: number,
    warehouseName?: string
  ): Observable<ResponseWarehouses> {
    if (warehouseName === undefined) {
      warehouseName = '';
    }

    this.apiUrl = `${this.config.urlWarehouseSearch}?warehouseName=${warehouseName}&page=${pageNumber}&size=${pageSize}`;

    return this.http.get<ResponseWarehouses>(this.apiUrl);
  }

}
