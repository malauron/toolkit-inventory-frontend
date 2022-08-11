/* eslint-disable no-underscore-dangle */
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Item } from '../classes/item.model';
import { MenuDto } from '../classes/menu-dto.model';
import { MenuIngredient } from '../classes/menu-ingredient.model';
import { Menu } from '../classes/menu.model';
import { PageInfo } from '../classes/page-info.model';
import { Uom } from '../classes/uom.model';
import { ConfigParam } from '../ConfigParam';

interface ResponseMenus {
  _embedded: {
    menus: Menu[];
  };
  page: PageInfo;
}

interface ResponseMenuIng {
  _embedded: {
    menuIngredients: {
      menuIngredientId: number;
      requiredQty: number;
      _embedded: {
        item: Item;
        requiredUom: Uom;
      };
    };
  };
}

@Injectable({
  providedIn: 'root'
})

export class MenusService {
  private apiUrl: string;

  // private _menusHasChanged = new BehaviorSubject<boolean>(false);
  private _menusHasChanged = new Subject<boolean>();


  constructor(private http: HttpClient, private config: ConfigParam){}

  get menuHasChanged() {
    return this._menusHasChanged;
  }

  getMenus(
    pageNumber?: number,
    pageSize?: number,
    menuName?: string
  ): Observable<ResponseMenus> {
    // this.apiUrl = `${this.config.urlMenus}`;

    if (menuName === undefined) {
      this.apiUrl = `${this.config.urlMenus}?page=${pageNumber}&size=${pageSize}`;
    } else {
      this.apiUrl = `${this.config.urlMenuSearch}?menuName=${menuName}&page=${pageNumber}&size=${pageSize}`;
    }
    return this.http.get<ResponseMenus>(this.apiUrl);
  }

  getMenu(menuId: number): Observable<Menu> {
    this.apiUrl = `${this.config.urlMenus}/${menuId}`;
    return this.http.get<Menu>(this.apiUrl);
  }

  getMenuIngredients(menuId: number): Observable<ResponseMenuIng> {
    this.apiUrl =  `${this.config.urlMenuIngredientSearch}${menuId}`;
    return this.http.get<ResponseMenuIng>(this.apiUrl);
  }

  postMenu(menu: MenuDto): Observable<ResponseMenus> {
    this.apiUrl = `${this.config.urlV1Menus}`;
    return this.http.post<ResponseMenus>(this.apiUrl, menu);
  }

  putMenu(menu: Menu): Observable<Menu> {
    return this.http.put<Menu>(this.config.urlV1Menus, menu);
  }

  postMenuIngredient(menuIng: MenuIngredient){
    this.apiUrl = `${this.config.urlV1MenuIngredients}`;
    return this.http.post(this.apiUrl, menuIng);
  }

  deleteMenuIngredient(menuIng: MenuIngredient) {
    const options = {
      headers: new HttpHeaders({
        contentType: 'application/json',
      }),
      body: menuIng,
    };
    this.apiUrl = `${this.config.urlV1MenuIngredients}`;
    return this.http.delete(this.apiUrl, options);
  }
}
