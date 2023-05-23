import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppParamsConfig } from 'src/app/Configurations/app-params.config';
import { PosItemPrice } from '../classes/pos-item-price.model';

@Injectable({
  providedIn: 'root',
})

export class PosItemPriceService {
  private apiUrl: string;

  constructor(
    private http: HttpClient,
    private config: AppParamsConfig,
  ){}

  getPosItemPrice(warehouseId: number, itemId: number) {
    this.apiUrl = `${this.config.urlPosItemPriceSearch}?warehouseId=${warehouseId}&itemId=${itemId}`;
    return this.http.get<PosItemPrice>(this.apiUrl);
  }
}
