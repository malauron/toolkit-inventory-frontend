/* eslint-disable no-underscore-dangle */
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { PageInfo } from 'src/app/classes/page-info.model';
import { AppParamsConfig } from 'src/app/Configurations/app-params.config';
import { ButcheryProductionDto } from '../classes/butchery-production-dto.model';
import { ButcheryProductionItem } from '../classes/butchery-production-item.model';
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

    let productionId: number;
    const productionStatus = ['Unposted','Posted','Cancelled'];

    if (isNaN(searchDesc)) {
      productionId = 0;
    } else {
      productionId = searchDesc;
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

  // getProductionList(
  //   orderIds: number[]
  // ): Observable<OrderMenuIngredientSummaryDto> {
  //   this.apiUrl = `${this.config.urlV1OrderMenuIngredientSummary}?orderIds=${orderIds}`;
  //   return this.http.get<OrderMenuIngredientSummaryDto>(this.apiUrl);
  // }

  postProduction(productionDto: ButcheryProductionDto): Observable<ButcheryProduction> {
    this.apiUrl = `${this.config.urlV1ButcheryProductions}`;
    return this.http.post<ButcheryProduction>(this.apiUrl, productionDto);
  }

  putProduction(productionDto: ButcheryProductionDto): Observable<ButcheryProductionDto> {
    this.apiUrl = `${this.config.urlV1ButcheryProductions}`;
    return this.http.put<ButcheryProductionDto>(this.apiUrl, productionDto);
  }

  putProductionSetStatus(productionDto: ButcheryProductionDto): Observable<ButcheryProductionDto> {
    this.apiUrl = `${this.config.urlV1ButcheryProductionsSetStatus}`;
    return this.http.put<ButcheryProductionDto>(this.apiUrl, productionDto);
  }

  // putProductionItem(purchaseItem: ButcheryProductionItem): Observable<ButcheryProductionDto> {
  //   this.apiUrl = `${this.config.urlV1ProductionItems}`;
  //   return this.http.put<ButcheryProductionDto>(this.apiUrl, purchaseItem);
  // }

  // deleteProductionItem(purchaseItem: ButcheryProductionItem): Observable<ButcheryProductionDto> {
  //   const options = {
  //     headers: new HttpHeaders({
  //       contentType: 'application/json'
  //     }),
  //     body: purchaseItem
  //   };
  //   this.apiUrl = `${this.config.urlV1ProductionItems}`;
  //   return this.http.delete<ButcheryProductionDto>(this.apiUrl, options);
  // }
}
