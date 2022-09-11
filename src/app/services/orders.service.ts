/* eslint-disable quote-props */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-underscore-dangle */
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { OrderDto } from '../classes/order-dto.model';
import { OrderMenuDto } from '../classes/order-menu-dto.model';
import { OrderMenuPrintPreviewDto } from '../classes/order-menu-print-preview.dto.model';
import { Order } from '../classes/order.model';
import { PageInfo } from '../classes/page-info.model';
import { AppParamsConfig } from '../Configurations/app-params.config';

interface ResponseOrders {
  _emdbedded: {
    orders: Order[];
  };
  page: PageInfo;
}

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  private apiUrl: string;

  private _ordersHaveChanged = new Subject<boolean>();
  private _orderMenuPrintPreview =
    new BehaviorSubject<OrderMenuPrintPreviewDto>(undefined);

  constructor(private http: HttpClient, private config: AppParamsConfig) {}

  get ordersHaveChanged() {
    return this._ordersHaveChanged;
  }

  get orderMenuPrintPreview() {
    return this._orderMenuPrintPreview;
  }

  getOrder(orderId: number): Observable<Order> {
    this.apiUrl = `${this.config.urlOrders}/${orderId}?projection=orderView`;

    const options = {
      headers: new HttpHeaders({
        'Cache-Control':
          'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
        Pragma: 'no-cache',
        Expires: '0',
        'Content-Type': 'application/json',
      }),
    };

    return this.http.get<Order>(this.apiUrl, options);
  }

  getOrders(
    pageNumber?: number,
    pageSize?: number,
    searchDesc?: any
  ): Observable<ResponseOrders> {
    if (searchDesc === undefined) {
      searchDesc = '';
    }

    let orderId: number;
    const orderStatus = ['Preparing', 'In Transit'];

    if (isNaN(searchDesc)) {
      orderId = 0;
    } else {
      orderId = searchDesc;
    }

    searchDesc = String(searchDesc).replace('%', '');
    searchDesc = String(searchDesc).replace('^', '');
    searchDesc = String(searchDesc).replace('[', '');
    searchDesc = String(searchDesc).replace(']', '');
    searchDesc = String(searchDesc).replace('|', '');
    searchDesc = String(searchDesc).replace('\\', '');

    // eslint-disable-next-line max-len
    this.apiUrl =
      `${this.config.urlOrdersSearch}` +
      `?orderId=${orderId}&customerName=${searchDesc}&address=${searchDesc}` +
      `&contactNo=${searchDesc}&orderStatus=${orderStatus}&page=${pageNumber}&size=${pageSize}`;

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

  putOrderSetStatus(orderdDto: OrderDto): Observable<OrderDto> {
    this.apiUrl = `${this.config.urlV1OrderSetStatus}`;
    return this.http.put<OrderDto>(this.apiUrl, orderdDto);
  }

  patchOrders(order: Order) {
    this.apiUrl = `${this.config.urlV1Orders}`;
    return this.http.patch(this.apiUrl, order);
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
