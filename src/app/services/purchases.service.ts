/* eslint-disable no-underscore-dangle */
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { OrderMenuIngredientSummaryDto } from '../classes/order-menu-ingredient-summary-dto.model';
import { PageInfo } from '../classes/page-info.model';
import { PurchaseDto } from '../classes/purchase-dto.model';
import { PurchaseItem } from '../classes/purchase-item.model';
import { PurchasePrintPreviewDto } from '../classes/purchase-print-preview.dto';
import { Purchase } from '../classes/purchase.model';
import { AppParamsConfig } from '../Configurations/app-params.config';

interface ResponsePurchases {
  _emdbedded: {
    purchases: Purchase[];
  };
  page: PageInfo;
}

@Injectable({
  providedIn: 'root',
})
export class PurchasesService {
  private apiUrl: string;

  private _purchasesHaveChanged = new Subject<boolean>();

  private _purchasePrintPreview = new BehaviorSubject<PurchasePrintPreviewDto>(
    undefined
  );

  constructor(private http: HttpClient, private config: AppParamsConfig) {}

  get purchasesHaveChanged() {
    return this._purchasesHaveChanged;
  }

  get purchasePrintPreview() {
    return this._purchasePrintPreview;
  }

  getPurchase(purchaseId: number): Observable<PurchaseDto> {

    this.apiUrl = `${this.config.urlV1Purchases}?purchaseId=${purchaseId}`;
    return this.http.get<PurchaseDto>(this.apiUrl);

  }

  getPurchases(
    pageNumber?: number,
    pageSize?: number,
    searchDesc?: any
  ): Observable<ResponsePurchases> {
    if (searchDesc === undefined) {
      searchDesc = '';
    }

    let purchaseId: number;
    const purchaseStatus = ['Unposted'];

    if (isNaN(searchDesc)) {
      purchaseId = 0;
    } else {
      purchaseId = searchDesc;
    }

    searchDesc = String(searchDesc).replace('%','');
    searchDesc = String(searchDesc).replace('^','');
    searchDesc = String(searchDesc).replace('[','');
    searchDesc = String(searchDesc).replace(']','');
    searchDesc = String(searchDesc).replace('|','');
    searchDesc = String(searchDesc).replace('\\','');

    // eslint-disable-next-line max-len
    this.apiUrl =
      `${this.config.urlPurchasesSearch}` +
      `?purchaseId=${purchaseId}&vendorName=${searchDesc}&address=${searchDesc}` +
      `&contactNo=${searchDesc}&purchaseStatus=${purchaseStatus}&page=${pageNumber}&size=${pageSize}`;
    return this.http.get<ResponsePurchases>(this.apiUrl);
  }

  getPurchaseList(
    orderIds: number[]
  ): Observable<OrderMenuIngredientSummaryDto> {
    this.apiUrl = `${this.config.urlV1OrderMenuIngredientSummary}?orderIds=${orderIds}`;
    return this.http.get<OrderMenuIngredientSummaryDto>(this.apiUrl);
  }

  postPurhcase(purchaseDto: PurchaseDto): Observable<Purchase> {
    this.apiUrl = `${this.config.urlV1Purchases}`;
    return this.http.post<Purchase>(this.apiUrl, purchaseDto);
  }

  putPurchase(purchaseDto: PurchaseDto): Observable<PurchaseDto> {
    this.apiUrl = `${this.config.urlV1Purchases}`;
    return this.http.put<PurchaseDto>(this.apiUrl, purchaseDto);
  }

  putPurchaseSetStatus(purchaseDto: PurchaseDto): Observable<PurchaseDto> {
    this.apiUrl = `${this.config.urlV1PurchaseSetStatus}`;
    return this.http.put<PurchaseDto>(this.apiUrl, purchaseDto);
  }

  putPurchaseItem(purchaseItem: PurchaseItem): Observable<PurchaseDto> {
    this.apiUrl = `${this.config.urlV1PurchaseItems}`;
    return this.http.put<PurchaseDto>(this.apiUrl, purchaseItem);
  }

  deletePurchaseItem(purchaseItem: PurchaseItem): Observable<PurchaseDto> {
    const options = {
      headers: new HttpHeaders({
        contentType: 'application/json'
      }),
      body: purchaseItem
    };
    this.apiUrl = `${this.config.urlV1PurchaseItems}`;
    return this.http.delete<PurchaseDto>(this.apiUrl, options);
  }
}
