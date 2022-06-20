import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MenuIngredient } from '../classes/menu-ingredient.model';
import { Menu } from '../classes/menu.model';
import { PageInfo } from '../classes/page-info.model';
import { ConfigParam } from '../ConfigParam';

interface ResponseMenus {
  _embedded: {
    menus: Menu[];
  };
  page: PageInfo;
}


@Injectable({
  providedIn: 'root'
})

export class MenuService {
  private apiUrl: string;

  constructor(private http: HttpClient, private config: ConfigParam){}

  getMenus(): Observable<ResponseMenus> {
    this.apiUrl = `${this.config.urlMenus}`;
    return this.http.get<ResponseMenus>(this.apiUrl);
  }

  getMenu(menuId: number): Observable<Menu> {
    this.apiUrl = `${this.config.urlMenus}/${menuId}`;
    return this.http.get<Menu>(this.apiUrl);
  }

  getMenuIngredients(menuId: number): Observable<MenuIngredient> {
    this.apiUrl =  `${this.config.urlMenuIngredientSearch}${menuId}`;
    console.log(this.apiUrl);
    return this.http.get<MenuIngredient>(this.apiUrl);
  }

  postMenus(menu: Menu): Observable<ResponseMenus> {
    this.apiUrl = `${this.config.urlV1Menus}`;
    return this.http.post<ResponseMenus>(this.apiUrl, menu);
  }

}
