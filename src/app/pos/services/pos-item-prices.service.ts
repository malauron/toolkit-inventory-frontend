/* eslint-disable id-blacklist */
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppParamsConfig } from 'src/app/Configurations/app-params.config';
import { PosItemPriceDto } from '../classes/pos-item-price-dto.model';
import { PosItemPrice } from '../classes/pos-item-price.model';

interface ResponsePosItemPrices {
  _embedded: {
    posItemPrices: PosItemPrice[];
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
export class PosItemPricesService {
  private apiUrl: string;
  private posItemPrices: string;

  constructor(private http: HttpClient, private config: AppParamsConfig) {
    this.posItemPrices = `${this.config.url}/posItemPrices`;
  }

  getPosItemPrice(
    warehouseId?: number,
    itemId?: number
  ): Observable<PosItemPrice> {
    this.apiUrl = `${this.config.urlPosItemPriceSearch}?warehouseId=${warehouseId}&itemId=${itemId}`;
    return this.http.get<PosItemPrice>(this.apiUrl);
  }

  getPosItemPrices(
    warehouseId?: number,
    itemName?: string,
    pageNumber?: number,
    pageSize?: number
  ): Observable<ResponsePosItemPrices> {
    this.apiUrl =
      `${this.posItemPrices}/search/findByWarehouseIdAndItemName?` +
      `warehouseId=${warehouseId}&itemName=${itemName}&page=${pageNumber}&size=${pageSize}`;
    return this.http.get<ResponsePosItemPrices>(this.apiUrl);
  }

  postPosItemPrice(
    posItemPriceDto: PosItemPriceDto
  ): Observable<PosItemPriceDto> {
    this.apiUrl = `${this.config.urlV1PosItemPrices}`;
    return this.http.post<PosItemPriceDto>(this.apiUrl, posItemPriceDto);
  }
}
