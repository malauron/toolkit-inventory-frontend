import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppParamsConfig } from 'src/app/Configurations/app-params.config';
import { PosItemPriceDto } from '../classes/pos-item-price-dto.model';
import { PosItemPrice } from '../classes/pos-item-price.model';

@Injectable({
  providedIn: 'root',
})

export class PosItemPricesService {
  private apiUrl: string;

  constructor(
    private http: HttpClient,
    private config: AppParamsConfig,
  ){}

  getPosItemPrice(warehouseId: number, itemId: number) {
    this.apiUrl = `${this.config.urlPosItemPriceSearch}?warehouseId=${warehouseId}&itemId=${itemId}`;
    return this.http.get<PosItemPrice>(this.apiUrl);
  }

  postPosItemPrice(posItemPriceDto: PosItemPriceDto): Observable<PosItemPriceDto> {
    this.apiUrl = `${this.config.urlV1PosItemPrices}`;
    return this.http.post<PosItemPriceDto>(this.apiUrl, posItemPriceDto);
  }
}
