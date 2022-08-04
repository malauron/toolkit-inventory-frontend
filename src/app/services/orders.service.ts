import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OrderDto } from '../classes/order-dto.model';
import { ConfigParam } from '../ConfigParam';

@Injectable({
  providedIn: 'root'
})

export class OrdersService{
  private apiUrl: string;

  constructor(
    private http: HttpClient,
    private config: ConfigParam
  ){}

    postOrders(order: OrderDto) {
      this.apiUrl = `${this.config.urlV1Orders}`;
      return this.http.post(this.apiUrl, order);
    }
}
