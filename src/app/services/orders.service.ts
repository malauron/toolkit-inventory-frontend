import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderDto } from '../classes/order-dto.model';
import { Order } from '../classes/order.model';
import { PageInfo } from '../classes/page-info.model';
import { ConfigParam } from '../ConfigParam';

interface ResponseOrders {
  _emdbedded: {
    orders: Order[];
  };
  page: PageInfo;
}

@Injectable({
  providedIn: 'root'
})

export class OrdersService{
  private apiUrl: string;

  constructor(
    private http: HttpClient,
    private config: ConfigParam
  ){}

  getOrders(
    pageNumber?: number,
    pageSize?: number,
    menuName?: string
    ): Observable<ResponseOrders> {
    this.apiUrl = `${this.config.urlOrders}`;
    return this.http.get<ResponseOrders>(this.apiUrl);
  }

  postOrders(order: OrderDto) {
    this.apiUrl = `${this.config.urlV1Orders}`;
    return this.http.post(this.apiUrl, order);
  }

}
