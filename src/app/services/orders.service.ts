import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderDto } from '../classes/order-dto.model';
import { OrderMenuDto } from '../classes/order-menu-dto.model';
import { OrderMenu } from '../classes/order-menu.model';
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

  getOrder(orderId: number): Observable<Order>{
    this.apiUrl = `${this.config.urlOrders}/${orderId}?projection=orderView`;
    return this.http.get<Order>(this.apiUrl);
  }

  getOrders(
    pageNumber?: number,
    pageSize?: number,
    searchDesc?: any
    ): Observable<ResponseOrders> {

      if (searchDesc === undefined) {
        this.apiUrl = `${this.config.urlOrders}?page=${pageNumber}&size=${pageSize}`;
      } else {

        let orderId: number;

        if (isNaN(searchDesc)) {
          orderId = 0;
        } else {
          orderId = searchDesc;
        }

        // eslint-disable-next-line max-len
        this.apiUrl = `${this.config.urlOrdersSearch}?orderId=${orderId}&customerName=${searchDesc}&address=${searchDesc}&contactNo=${searchDesc}&page=${pageNumber}&size=${pageSize}`;

      }
    return this.http.get<ResponseOrders>(this.apiUrl);
  }

  getOrderMenus(orderId: number): Observable<OrderMenuDto> {

    this.apiUrl = `${this.config.urlV1OrderMenus}?orderId=${orderId}`;
    return this.http.get<OrderMenuDto>(this.apiUrl);
  }

  postOrders(order: OrderDto) {
    this.apiUrl = `${this.config.urlV1Orders}`;
    return this.http.post(this.apiUrl, order);
  }

  deleteOrderMenu(id: number) {
    this.apiUrl = `${this.config.urlV1OrderMenus}?orderMenuId=${id}`;
    return this.http.delete(this.apiUrl);
  }

  deleteOrderMenuIngredient(id: number) {
    this.apiUrl = `${this.config.urlV1OrderMenuIngredients}?orderMenuIngredientId=${id}`;
    return this.http.delete(this.apiUrl);
  }
}
