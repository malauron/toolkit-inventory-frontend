/* eslint-disable no-underscore-dangle */
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { PageInfo } from 'src/app/classes/page-info.model';
import { AppParamsConfig } from 'src/app/Configurations/app-params.config';
import { ButcheryProductionDto } from '../classes/butchery-production-dto.model';
import { ButcheryProductionItem } from '../classes/butchery-production-item.model';
import { ButcheryProductionSource } from '../classes/butchery-production-source.model';
import { ButcheryProduction } from '../classes/butchery-production.model';

interface ResponseProductions {
  _emdbedded: {
    butcheryProductions: ButcheryProduction[];
  };
  page: PageInfo;
}

@Injectable({
  providedIn: 'root',
})
export class ButcheryProductionsService {
  private apiUrl: string;

  private _productionsHaveChanged = new Subject<boolean>();

  // private _productionPrintPreview = new BehaviorSubject<ProductionPrintPreviewDto>(
  //   undefined
  // );

  constructor(private http: HttpClient, private config: AppParamsConfig) {}

  get productionsHaveChanged() {
    return this._productionsHaveChanged;
  }

  // get purchasePrintPreview() {
  //   return this._productionPrintPreview;
  // }

  getProduction(productionId: number): Observable<ButcheryProductionDto> {

    this.apiUrl = `${this.config.urlV1ButcheryProductions}?butcheryProductionId=${productionId}`;
    return this.http.get<ButcheryProductionDto>(this.apiUrl);

  }

  getProductions(
    pageNumber?: number,
    pageSize?: number,
    searchDesc?: any
  ): Observable<ResponseProductions> {
    if (searchDesc === undefined) {
      searchDesc = '';
    }

    let productionId: string;
    const productionStatus = ['Unposted','Posted','Cancelled'];

    if (isNaN(searchDesc)) {
      productionId = '-';
    } else {
      productionId = String(Number(searchDesc));
    }

    searchDesc = String(searchDesc).replace('%','');
    searchDesc = String(searchDesc).replace('^','');
    searchDesc = String(searchDesc).replace('[','');
    searchDesc = String(searchDesc).replace(']','');
    searchDesc = String(searchDesc).replace('|','');
    searchDesc = String(searchDesc).replace('\\','');

    this.apiUrl =
      `${this.config.urlButcheryProductionsSearch}` +
      `?butcheryProductionId=${productionId}&warehouseName=${searchDesc}` +
      `&productionStatus=${productionStatus}&page=${pageNumber}&size=${pageSize}`;
    return this.http.get<ResponseProductions>(this.apiUrl);
  }

  getProductionSources(receivingId: number): Observable<ButcheryProductionDto> {

    this.apiUrl = `${this.config.urlV1ButcheryProductionSources}?butcheryReceivingId=${receivingId}`;
    return this.http.get<ButcheryProductionDto>(this.apiUrl);

  }

  postProduction(productionDto: ButcheryProductionDto): Observable<ButcheryProductionDto> {
    this.apiUrl = `${this.config.urlV1ButcheryProductions}`;
    return this.http.post<ButcheryProductionDto>(this.apiUrl, productionDto);
  }

  putProduction(productionDto: ButcheryProductionDto): Observable<ButcheryProductionDto> {
    this.apiUrl = `${this.config.urlV1ButcheryProductions}`;
    return this.http.put<ButcheryProductionDto>(this.apiUrl, productionDto);
  }

  putProductionSetStatus(productionDto: ButcheryProductionDto): Observable<ButcheryProductionDto> {
    this.apiUrl = `${this.config.urlV1ButcheryProductionsSetStatus}`;
    return this.http.put<ButcheryProductionDto>(this.apiUrl, productionDto);
  }

  putProductionItem(productionItem: ButcheryProductionItem): Observable<ButcheryProductionDto> {
    this.apiUrl = `${this.config.urlV1ButcheryProductionItems}`;
    return this.http.put<ButcheryProductionDto>(this.apiUrl, productionItem);
  }

  putProductionSource(productionSource: ButcheryProductionSource): Observable<ButcheryProductionDto> {
    this.apiUrl = `${this.config.urlV1ButcheryProductionSources}`;
    return this.http.put<ButcheryProductionDto>(this.apiUrl, productionSource);
  }

  deleteProductionItem(productionItem: ButcheryProductionItem): Observable<ButcheryProductionDto> {
    const options = {
      headers: new HttpHeaders({
        contentType: 'application/json'
      }),
      body: productionItem
    };
    this.apiUrl = `${this.config.urlV1ButcheryProductionItems}`;
    return this.http.delete<ButcheryProductionDto>(this.apiUrl, options);
  }

  deleteProductionSource(productionSource: ButcheryProductionSource): Observable<ButcheryProductionDto> {
    const options = {
      headers: new HttpHeaders({
        contentType: 'application/json'
      }),
      body: productionSource
    };
    this.apiUrl = `${this.config.urlV1ButcheryProductionSources}`;
    return this.http.delete<ButcheryProductionDto>(this.apiUrl, options);
  }
}
