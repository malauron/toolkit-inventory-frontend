/* eslint-disable no-underscore-dangle */
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { PageInfo } from 'src/app/classes/page-info.model';
import { AppParamsConfig } from 'src/app/Configurations/app-params.config';
import { PosSaleDto } from '../classes/pos-sale-dto.model';
import { PosSaleItem } from '../classes/pos-sale-item.model';
import { PosSale } from '../classes/pos-sale.model';

interface ResponsePosSales {
  _emdbedded: {
    posSales: PosSale[];
  };
  page: PageInfo;
}

@Injectable({
  providedIn: 'root',
})

export class PosSalesService {
  private apiUrl: string;

  private _salesHaveChanged = new Subject<boolean>();

  constructor(private http: HttpClient, private config: AppParamsConfig) {}

  get salesHaveChanged() {
    return this._salesHaveChanged;
  }

  getSale(saleId: number): Observable<PosSaleDto> {

    this.apiUrl = `${this.config.urlV1PosSales}?posSaleId=${saleId}`;
    return this.http.get<PosSaleDto>(this.apiUrl);

  }

  getSales(
    pageNumber?: number,
    pageSize?: number,
    searchDesc?: any
  ): Observable<ResponsePosSales> {
    if (searchDesc === undefined) {
      searchDesc = '';
    }

    let saleId: string;
    const saleStatus = ['Unposted','Posted','Cancelled'];

    if (isNaN(searchDesc)) {
      saleId = '-';
    } else {
      saleId = String(Number(searchDesc));
    }

    searchDesc = String(searchDesc).replace('%','');
    searchDesc = String(searchDesc).replace('^','');
    searchDesc = String(searchDesc).replace('[','');
    searchDesc = String(searchDesc).replace(']','');
    searchDesc = String(searchDesc).replace('|','');
    searchDesc = String(searchDesc).replace('\\','');

    this.apiUrl =
      `${this.config.urlPosSalesSearch}` +
      `?posSaleId=${saleId}&warehouseName=${searchDesc}` +
      `&saleStatus=${saleStatus}&page=${pageNumber}&size=${pageSize}`;
    return this.http.get<ResponsePosSales>(this.apiUrl);
  }

  postSale(saleDto: PosSaleDto): Observable<PosSale> {
    this.apiUrl = `${this.config.urlV1PosSales}`;
    return this.http.post<PosSale>(this.apiUrl, saleDto);
  }

  putSale(saleDto: PosSaleDto): Observable<PosSaleDto> {
    this.apiUrl = `${this.config.urlV1PosSales}`;
    return this.http.put<PosSaleDto>(this.apiUrl, saleDto);
  }

  putSaleSetStatus(saleDto: PosSaleDto): Observable<PosSaleDto> {
    this.apiUrl = `${this.config.urlV1PosSalesSetStatus}`;
    return this.http.put<PosSaleDto>(this.apiUrl, saleDto);
  }

  getSaleItems(id: number): Observable<PosSaleItem[]> {
    this.apiUrl = `${this.config.urlV1PosSaleItems}?posSaleId=${id}`;
    return this.http.get<PosSaleItem[]>(this.apiUrl);
  }

  putSaleItem(saleItem: PosSaleItem): Observable<PosSaleDto> {
    this.apiUrl = `${this.config.urlV1PosSaleItems}`;
    return this.http.put<PosSaleDto>(this.apiUrl, saleItem);
  }

  deleteSaleItem(saleItem: PosSaleItem): Observable<PosSaleDto> {
    const options = {
      headers: new HttpHeaders({
        contentType: 'application/json'
      }),
      body: saleItem
    };
    this.apiUrl = `${this.config.urlV1PosSaleItems}`;
    return this.http.delete<PosSaleDto>(this.apiUrl, options);
  }
}
