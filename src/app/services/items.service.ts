/* eslint-disable max-len */
/* eslint-disable no-underscore-dangle */
/* eslint-disable id-blacklist */
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ItemBom } from '../classes/item-bom.model';
import { ItemCost } from '../classes/item-cost.model';
import { ItemDto } from '../classes/item-dto.model';
import { ItemGeneric } from '../classes/item-generic.model';
import { ItemUom } from '../classes/item-uom.model';
import { Item } from '../classes/item.model';
import { AppParamsConfig } from '../Configurations/app-params.config';
import { filterString } from '../utils/utils';

interface ResponseItems {
  _embedded: {
    items: Item[];
  };
  page: {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
  };
}

interface ResponseItemCosts {
  _embedded: {
    itemCosts: ItemCost[];
  };
  page: {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
  };
}

interface ResponseItemUoms {
  _embedded: {
    itemUoms: ItemUom[];
  };
  page: {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
  };
}

@Injectable({
  providedIn: 'root',
})
export class ItemsService {
  private apiUrl: string;

  private _item = new Subject<Item>();

  constructor(private http: HttpClient, private config: AppParamsConfig) {}

  get item() {
    return this._item;
  }

  getItemByItemCode(searchDesc?: any): Observable<ItemDto> {
    if (searchDesc === undefined) {
      searchDesc = '';
    }

    // searchDesc = String(searchDesc).replace('%','');
    // searchDesc = String(searchDesc).replace('^','');
    // searchDesc = String(searchDesc).replace('[','');
    // searchDesc = String(searchDesc).replace(']','');
    // searchDesc = String(searchDesc).replace('|','');
    // searchDesc = String(searchDesc).replace('\\','');

    searchDesc = filterString(searchDesc);

    this.apiUrl = `${this.config.urlV1ItemsFindByItemCode}${searchDesc}`;
    return this.http.get<ItemDto>(this.apiUrl);
  }

  getItems(
    pageNumber?: number,
    pageSize?: number,
    itemName?: string
  ): Observable<ResponseItems> {
    if (itemName === undefined) {
      this.apiUrl = `${this.config.urlItems}?page=${pageNumber}&size=${pageSize}`;
    } else {
      this.apiUrl = `${this.config.urlItemSearch}?itemName=${itemName}&page=${pageNumber}&size=${pageSize}`;
    }

    return this.http.get<ResponseItems>(this.apiUrl);
  }

  getItem(itemId: number): Observable<Item> {
    this.apiUrl = `${this.config.urlItems}/${itemId}?projection=itemView`;

    return this.http.get<Item>(this.apiUrl);
  }

  getItemCosts(warehouseId: number): Observable<ItemCost> {
    this.apiUrl = `${this.config.urlV1ItemCosts}?warehouseId=${warehouseId}`;
    return this.http.get<ItemCost>(this.apiUrl);
  }

  getItemCostsByPage(
    searchDesc?: string,
    warehouseId?: number,
    pageNumber?: number,
    pageSize?: number,
    itemName?: string
  ): Observable<ResponseItemCosts> {
    if (searchDesc === undefined) {
      searchDesc = '';
    }

    // searchDesc = String(searchDesc).replace('%','');
    // searchDesc = String(searchDesc).replace('^','');
    // searchDesc = String(searchDesc).replace('[','');
    // searchDesc = String(searchDesc).replace(']','');
    // searchDesc = String(searchDesc).replace('|','');
    // searchDesc = String(searchDesc).replace('\\','');

    searchDesc = filterString(searchDesc);

    this.apiUrl =
      `${this.config.urlItemCostSearchByWarehouseIdAndItemName}?projection=itemCostView&` +
      `warehouseId=${warehouseId}&itemName=${searchDesc}&page=${pageNumber}&size=${pageSize}`;
    return this.http.get<ResponseItemCosts>(this.apiUrl);
  }

  postItem(itemDto: ItemDto): Observable<Item> {
    return this.http.post<Item>(this.config.urlV1Items, itemDto);
  }

  putItem(itemDto: ItemDto): Observable<Item> {
    return this.http.put<Item>(this.config.urlV1Items, itemDto);
  }

  getItemUoms(itemId: number): Observable<ItemDto> {
    this.apiUrl = `${this.config.urlV1ItemUoms}?itemId=${itemId}`;

    return this.http.get<ItemDto>(this.apiUrl);
  }

  getItemUomsByItemIdUomName(
    pageNumber?: number,
    pageSize?: number,
    itemId?: number,
    uomName?: string
  ): Observable<ResponseItemUoms> {
    if (uomName === undefined) {
      uomName = '';
    }

    uomName = filterString(uomName);

    this.apiUrl = `${this.config.urlItemUomSearchByItemIdUomName}?itemId=${itemId}&uomName=${uomName}` +
                  `&page=${pageNumber}&size=${pageSize}`;

    return this.http.get<ResponseItemUoms>(this.apiUrl);
  }

  getItemBoms(itemId: number): Observable<ItemDto> {
    this.apiUrl = `${this.config.urlV1ItemBoms}?itemId=${itemId}`;

    return this.http.get<ItemDto>(this.apiUrl);
  }

  getItemGenerics(itemId: number): Observable<ItemDto> {
    this.apiUrl = `${this.config.urlV1ItemGenerics}?itemId=${itemId}`;

    return this.http.get<ItemDto>(this.apiUrl);
  }

  putItemGenerics(itemGeneric: ItemGeneric): Observable<ItemGeneric> {
    this.apiUrl = `${this.config.urlV1ItemGenerics}`;

    return this.http.put<ItemGeneric>(this.apiUrl, itemGeneric);
  }

  postItemUoms(itemUom: ItemUom): Observable<ItemUom> {
    return this.http.post<ItemUom>(this.config.urlV1ItemUoms, itemUom);
  }

  postItemBoms(itemBom: ItemBom): Observable<ItemBom> {
    return this.http.post<ItemBom>(this.config.urlV1ItemBoms, itemBom);
  }

  deleteItemUoms(itemUom: ItemUom) {
    const options = {
      headers: new HttpHeaders({
        contentType: 'application/json',
      }),
      body: itemUom,
    };
    return this.http.delete(this.config.urlV1ItemUoms, options);
  }

  deleteItemBoms(itemBomId: number) {
    this.apiUrl = `${this.config.urlV1ItemBoms}?itemBomId=${itemBomId}`;
    return this.http.delete(this.apiUrl);
  }
}
