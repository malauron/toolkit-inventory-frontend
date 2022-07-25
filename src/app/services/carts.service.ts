import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CartMenuDto } from '../classes/cart-menu-dto.model';
import { Menu } from '../classes/menu.model';
import { ConfigParam } from '../ConfigParam';

@Injectable({
  providedIn: 'root'
})

export class CartsService {

  private apiUrl: string;

  constructor(
    private http: HttpClient,
    private config: ConfigParam
  ) {}

  postCartMenu(cartMenuDto: CartMenuDto){
    this.apiUrl = `${this.config.urlV1CartMenus}`;
    return this.http.post(this.apiUrl, cartMenuDto);
  }

  postCartSingleMenu(menu: Menu) {
    this.apiUrl = `${this.config.urlV1CartSingleMenu}`;
    return this.http.post(this.apiUrl, menu);
  }

}
