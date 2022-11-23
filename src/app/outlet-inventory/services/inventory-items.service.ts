/* eslint-disable id-blacklist */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppParamsConfig } from 'src/app/Configurations/app-params.config';
import { InventoryItemDto } from '../classes/inventory-item-dto.model';
import { InventoryItem } from '../classes/inventory-item.model';
import { filterString } from '../utils/utils';

interface ResponseInventoryItems {
  _embedded: {
    inventoryItems: InventoryItem[];
  };
  page: {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
  };
}

@Injectable({
  providedIn: 'root'
})

export class InventoryItemsService {

  private apiUrl: string;

  constructor(
    private http: HttpClient,
    private config: AppParamsConfig
  ){}

  getInventoryItemsByPage(
    searchDesc?: string,
    warehouseId?: number,
    pageNumber?: number,
    pageSize?: number): Observable<ResponseInventoryItems> {

    if (searchDesc === undefined) {
      searchDesc = '';
    } else {
      searchDesc = filterString(searchDesc);
    }

    this.apiUrl = `${this.config.urlInventoryItemsSearch}` +
                    `warehouseId=${warehouseId}&itemName=${searchDesc}&page=${pageNumber}&size=${pageSize}`;
    return this.http.get<ResponseInventoryItems>(this.apiUrl);

  }

  getAllByWarehouseWithQty(warehouseId: number): Observable<InventoryItem> {
    this.apiUrl = `${this.config.urlV1InventoryItems}?warehouseId=${warehouseId}`;
    return this.http.get<InventoryItem>(this.apiUrl);
  }

  setEndingQty(invItem: InventoryItemDto) {
    this.apiUrl =  `${this.config.urlV1InventoryItemsSetEndingQty}`;
    return this.http.put(this.apiUrl,invItem);
  }

  setPrice(invItem: InventoryItemDto) {
    this.apiUrl =  `${this.config.urlV1InventoryItemsSetPrice}`;
    return this.http.put(this.apiUrl,invItem);
  }

  setQty(invItem: InventoryItemDto) {
    this.apiUrl = `${this.config.urlV1InventoryItems}/qty`;
    return this.http.put(this.apiUrl, invItem);
  }
}
