/* eslint-disable no-underscore-dangle */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { OrderMenuIngredientSummaryDto } from '../classes/order-menu-ingredient-summary-dto.model';
import { PurchaseDto } from '../classes/purchase-dto.model';
import { PurchasePrintPreviewDto } from '../classes/purchase-print-preview.dto';
import { Purchase } from '../classes/purchase.model';
import { AppParamsConfig } from '../Configurations/app-params.config';

@Injectable({
  providedIn: 'root',
})
export class PurchasesService {

  private apiUrl: string;

  private _purchasePrintPreview =
    new BehaviorSubject<PurchasePrintPreviewDto>(
      undefined
     );

  constructor(
    private http: HttpClient,
    private config: AppParamsConfig
  ){}

  get purchasePrintPreview() {
    return this._purchasePrintPreview;
  }

  getPurchaseList(orderIds: number[]): Observable<OrderMenuIngredientSummaryDto> {
    this.apiUrl = `${this.config.urlV1OrderMenuIngredientSummary}?orderIds=${orderIds}`;
    return this.http.get<OrderMenuIngredientSummaryDto>(this.apiUrl);
  }

  postPurhcase(purchaseDto: PurchaseDto): Observable<Purchase>  {
    this.apiUrl = `${this.config.urlV1Purchases}`;
    return this.http.post<Purchase>(this.apiUrl, purchaseDto);
  }

}
