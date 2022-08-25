/* eslint-disable no-underscore-dangle */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { OrderMenuIngredientSummaryDto } from '../classes/order-menu-ingredient-summary-dto.model';
import { PurchaseDto } from '../classes/purchase-dto.model';
import { PurchaseItem } from '../classes/purchase-item.model';
import { PurchasePrintPreviewDto } from '../classes/purchase-print-preview.dto';
import { Purchase } from '../classes/purchase.model';
import { AppParamsConfig } from '../Configurations/app-params.config';

@Injectable({
  providedIn: 'root',
})
export class PurchasesService {
  private apiUrl: string;

  private _purchaseItem = new BehaviorSubject<PurchaseItem>(undefined);

  private _purchasePrintPreview = new BehaviorSubject<PurchasePrintPreviewDto>(
    undefined
  );

  constructor(private http: HttpClient, private config: AppParamsConfig) {}

  get purchaseItem() {
    return this._purchaseItem;
  }

  get purchasePrintPreview() {
    return this._purchasePrintPreview;
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

  putPurchaseSetVendor(purchaseDto: PurchaseDto) {
    this.apiUrl = `${this.config.urlV1PurchaseSetVendor}`;
    return this.http.put(this.apiUrl, purchaseDto);
  }

  putPurchaseItem(purchaseItem: PurchaseItem) {
    this.apiUrl = `${this.config.urlV1PurchaseItems}`;
    return this.http.put(this.apiUrl, purchaseItem);
  }
}
