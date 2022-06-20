import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ConfigParam {
  url: any;
  urlItems: any;
  urlItemSearch: any;
  urlItemUoms: any;
  urlItemUomSearch: any;
  urlUoms: any;
  urlMenus: any;
  urlMenuIngredients: any;
  urlMenuIngredientSearch: any;

  urlV1: any;
  urlV1Items: any;
  urlV1ItemUoms: any;
  urlV1Menus: any;

  pageSize: number;

  constructor() {
    this.url = 'http://localhost:8443/api';

    this.urlItems = this.url + '/items';
    this.urlItemSearch = `${this.urlItems}/search/findByItemNameContainingOrderByItemName`;
    this.urlItemUoms = `${this.url}/itemUoms`;
    this.urlItemUomSearch = `${this.urlItemUoms}/search/findByItemId`;
    this.urlUoms = this.url + '/uoms';
    this.urlMenus = `${this.url}/menus`;
    this.urlMenuIngredients = `${this.url}/menuIngredients`;
    this.urlMenuIngredientSearch = `${this.urlMenuIngredients}/search/findByMenuId?menuId=`;

    this.urlV1 = 'http://localhost:8443/api/v1';
    this.urlV1Items = this.urlV1 + '/items';
    this.urlV1ItemUoms = this.urlV1 + '/itemUoms';
    this.urlV1Menus = this.urlV1 + '/menus';



    this.pageSize = 20;
  }
}
