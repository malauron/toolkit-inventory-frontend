import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CartMenuDto } from '../classes/cart-menu-dto.model';
import { CartMenuIngredient } from '../classes/cart-menu-ingredient.model';
import { CartMenu } from '../classes/cart-menu.model';
import { Menu } from '../classes/menu.model';
import { ConfigParam } from '../ConfigParam';

interface ResponseCartMenus {
  _embedded: {
    cartMenus: CartMenu[];
  };
}

@Injectable({
  providedIn: 'root'
})

export class CartsService {

  private apiUrl: string;

  constructor(
    private http: HttpClient,
    private config: ConfigParam
  ) {}

  getCartMenus(): Observable<ResponseCartMenus> {
    this.apiUrl = `${this.config.urlCartMenuSearch}`;
    return this.http.get<ResponseCartMenus>(this.apiUrl);
  }

  postCartMenu(cartMenuDto: CartMenuDto){
    this.apiUrl = `${this.config.urlV1CartMenus}`;
    return this.http.post(this.apiUrl, cartMenuDto);
  }

  postCartSingleMenu(menu: Menu) {
    this.apiUrl = `${this.config.urlV1CartSingleMenu}`;
    return this.http.post(this.apiUrl, menu);
  }

  deleteCartMenu(menu: CartMenu) {
    const options = {
      headers: new HttpHeaders({
        contentType: 'application/json'
      }),
      body: menu
    };
    this.apiUrl = `${this.config.urlV1CartMenus}`;
    return this.http.delete(this.apiUrl, options);
  }

  deleteCartMenuIngredient(ing: CartMenuIngredient) {
    const options = {
      headers: new HttpHeaders({
        contentType: 'application/json'
      }),
      body: ing
    };
    this.apiUrl = `${this.config.urlV1CartMenuIngredients}`;
    return this.http.delete(this.apiUrl, options);
  }

}
