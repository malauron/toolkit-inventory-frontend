/* eslint-disable no-underscore-dangle */
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { PageInfo } from 'src/app/classes/page-info.model';
import { AppParamsConfig } from 'src/app/Configurations/app-params.config';
import { ButcheryReleasingDto } from '../classes/butchery-releasing-dto.model';
import { ButcheryReleasingItem } from '../classes/butchery-releasing-item.model';
import { ButcheryReleasing } from '../classes/butchery-releasing.model';

interface ResponseReleasings {
  _emdbedded: {
    butcheryReleasings: ButcheryReleasing[];
  };
  page: PageInfo;
}

@Injectable({
  providedIn: 'root',
})
export class ButcheryReleasingsService {
  private apiUrl: string;

  private _releasingsHaveChanged = new Subject<boolean>();

  // private _releasingPrintPreview = new BehaviorSubject<ReleasingPrintPreviewDto>(
  //   undefined
  // );

  constructor(private http: HttpClient, private config: AppParamsConfig) {}

  get releasingsHaveChanged() {
    return this._releasingsHaveChanged;
  }

  // get purchasePrintPreview() {
  //   return this._releasingPrintPreview;
  // }

  getReleasing(releasingId: number): Observable<ButcheryReleasingDto> {

    this.apiUrl = `${this.config.urlV1ButcheryReleasings}?butcheryReleasingId=${releasingId}`;
    return this.http.get<ButcheryReleasingDto>(this.apiUrl);

  }

  getReleasings(
    pageNumber?: number,
    pageSize?: number,
    searchDesc?: any
  ): Observable<ResponseReleasings> {
    if (searchDesc === undefined) {
      searchDesc = '';
    }

    let releasingId: string;
    const releasingStatus = ['Unposted','Posted','Cancelled'];

    if (isNaN(searchDesc)) {
      releasingId = '-';
    } else {
      releasingId = String(Number(searchDesc));
    }

    searchDesc = String(searchDesc).replace('%','');
    searchDesc = String(searchDesc).replace('^','');
    searchDesc = String(searchDesc).replace('[','');
    searchDesc = String(searchDesc).replace(']','');
    searchDesc = String(searchDesc).replace('|','');
    searchDesc = String(searchDesc).replace('\\','');

    // this.apiUrl =
    //   `${this.config.urlButcheryReleasingsSearch}` +
    //   `?butcheryReleasingId=${releasingId}&warehouseName=${searchDesc}&customerName=${searchDesc}` +
    //   `&releasingStatus=${releasingStatus}&page=${pageNumber}&size=${pageSize}`;

    this.apiUrl =
      `${this.config.urlButcheryReleasingsSearch}` +
      `?butcheryReleasingId=${releasingId}&warehouseName=${searchDesc}&destinationWhse=${searchDesc}` +
      `&releasingStatus=${releasingStatus}&page=${pageNumber}&size=${pageSize}`;
    return this.http.get<ResponseReleasings>(this.apiUrl);
  }

  // getReleasingList(
  //   orderIds: number[]
  // ): Observable<OrderMenuIngredientSummaryDto> {
  //   this.apiUrl = `${this.config.urlV1OrderMenuIngredientSummary}?orderIds=${orderIds}`;
  //   return this.http.get<OrderMenuIngredientSummaryDto>(this.apiUrl);
  // }

  postReleasing(releasingDto: ButcheryReleasingDto): Observable<ButcheryReleasing> {
    this.apiUrl = `${this.config.urlV1ButcheryReleasings}`;
    return this.http.post<ButcheryReleasing>(this.apiUrl, releasingDto);
  }

  putReleasing(releasingDto: ButcheryReleasingDto): Observable<ButcheryReleasingDto> {
    this.apiUrl = `${this.config.urlV1ButcheryReleasings}`;
    return this.http.put<ButcheryReleasingDto>(this.apiUrl, releasingDto);
  }

  putReleasingSetStatus(releasingDto: ButcheryReleasingDto): Observable<ButcheryReleasingDto> {
    this.apiUrl = `${this.config.urlV1ButcheryReleasingsSetStatus}`;
    return this.http.put<ButcheryReleasingDto>(this.apiUrl, releasingDto);
  }

  putReleasingItem(releasingItem: ButcheryReleasingItem): Observable<ButcheryReleasingDto> {
    this.apiUrl = `${this.config.urlV1ButcheryReleasingItems}`;
    return this.http.put<ButcheryReleasingDto>(this.apiUrl, releasingItem);
  }

  deleteReleasingItem(releasingItem: ButcheryReleasingItem): Observable<ButcheryReleasingDto> {
    const options = {
      headers: new HttpHeaders({
        contentType: 'application/json'
      }),
      body: releasingItem
    };
    this.apiUrl = `${this.config.urlV1ButcheryReleasingItems}`;
    return this.http.delete<ButcheryReleasingDto>(this.apiUrl, options);
  }
}
