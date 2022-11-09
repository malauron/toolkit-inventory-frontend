/* eslint-disable no-underscore-dangle */
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { PageInfo } from 'src/app/classes/page-info.model';
import { AppParamsConfig } from 'src/app/Configurations/app-params.config';
import { ButcheryReceivingDto } from '../classes/butchery-receiving-dto.model';
import { ButcheryReceivingItem } from '../classes/butchery-receiving-item.model';
import { ButcheryReceiving } from '../classes/butchery-receiving.model';

interface ResponseReceivings {
  _emdbedded: {
    butcheryReceivings: ButcheryReceiving[];
  };
  page: PageInfo;
}

@Injectable({
  providedIn: 'root',
})
export class ButcheryReceivingsService {
  private apiUrl: string;

  private _receivingsHaveChanged = new Subject<boolean>();

  // private _receivingPrintPreview = new BehaviorSubject<ReceivingPrintPreviewDto>(
  //   undefined
  // );

  constructor(private http: HttpClient, private config: AppParamsConfig) {}

  get receivingsHaveChanged() {
    return this._receivingsHaveChanged;
  }

  // get purchasePrintPreview() {
  //   return this._receivingPrintPreview;
  // }

  getReceiving(receivingId: number): Observable<ButcheryReceivingDto> {

    this.apiUrl = `${this.config.urlV1ButcheryReceivings}?butcheryReceivingId=${receivingId}`;
    return this.http.get<ButcheryReceivingDto>(this.apiUrl);

  }

  getReceivings(
    pageNumber?: number,
    pageSize?: number,
    searchDesc?: any
  ): Observable<ResponseReceivings> {
    if (searchDesc === undefined) {
      searchDesc = '';
    }

    let receivingId: string;
    const receivingStatus = ['Unposted','Posted','Cancelled'];

    if (isNaN(searchDesc)) {
      receivingId = '-';
    } else {
      receivingId = String(Number(searchDesc));
    }

    searchDesc = String(searchDesc).replace('%','');
    searchDesc = String(searchDesc).replace('^','');
    searchDesc = String(searchDesc).replace('[','');
    searchDesc = String(searchDesc).replace(']','');
    searchDesc = String(searchDesc).replace('|','');
    searchDesc = String(searchDesc).replace('\\','');

    this.apiUrl =
      `${this.config.urlButcheryReceivingsSearch}` +
      `?butcheryReceivingId=${receivingId}&warehouseName=${searchDesc}&customerName=${searchDesc}` +
      `&receivingStatus=${receivingStatus}&page=${pageNumber}&size=${pageSize}`;
    return this.http.get<ResponseReceivings>(this.apiUrl);
  }

  getReceivingItem(receivingItemId: number): Observable<ButcheryReceivingItem> {

    this.apiUrl = `${this.config.urlV1ButcheryReceivingItems}?butcheryReceivingItemId=${receivingItemId}`;
    return this.http.get<ButcheryReceivingItem>(this.apiUrl);

  }

  getReceivingItemsByWarehouse(warehouseId: number): Observable<ButcheryReceivingItem[]> {

    this.apiUrl = `${this.config.urlV1ButcheryReceivingItems}/warehouses?warehouseId=${warehouseId}`;
    return this.http.get<ButcheryReceivingItem[]>(this.apiUrl);

  }

  postReceiving(receivingDto: ButcheryReceivingDto): Observable<ButcheryReceiving> {
    this.apiUrl = `${this.config.urlV1ButcheryReceivings}`;
    return this.http.post<ButcheryReceiving>(this.apiUrl, receivingDto);
  }

  putReceiving(receivingDto: ButcheryReceivingDto): Observable<ButcheryReceivingDto> {
    this.apiUrl = `${this.config.urlV1ButcheryReceivings}`;
    return this.http.put<ButcheryReceivingDto>(this.apiUrl, receivingDto);
  }

  putReceivingSetStatus(receivingDto: ButcheryReceivingDto): Observable<ButcheryReceivingDto> {
    this.apiUrl = `${this.config.urlV1ButcheryReceivingsSetStatus}`;
    return this.http.put<ButcheryReceivingDto>(this.apiUrl, receivingDto);
  }

  putReceivingItem(receivingItem: ButcheryReceivingItem): Observable<ButcheryReceivingDto> {
    this.apiUrl = `${this.config.urlV1ButcheryReceivingItems}`;
    return this.http.put<ButcheryReceivingDto>(this.apiUrl, receivingItem);
  }

  deleteReceivingItem(receivingItem: ButcheryReceivingItem): Observable<ButcheryReceivingDto> {
    const options = {
      headers: new HttpHeaders({
        contentType: 'application/json'
      }),
      body: receivingItem
    };
    this.apiUrl = `${this.config.urlV1ButcheryReceivingItems}`;
    return this.http.delete<ButcheryReceivingDto>(this.apiUrl, options);
  }
}
