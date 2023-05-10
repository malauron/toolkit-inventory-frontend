/* eslint-disable id-blacklist */
/* eslint-disable @typescript-eslint/quotes */
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AppParamsConfig } from "src/app/Configurations/app-params.config";
import { InventoryHistory } from "../classes/inventory-history.model";
import { InventoryItem } from "../classes/inventory-item.model";
import { filterString } from '../utils/utils';


interface ResponseInventoryHistories {
  _embedded: {
    inventoryHistories: InventoryHistory[];
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

export class InventoryHistoriesService {

  private apiUrl: string;

  constructor(
    private http: HttpClient,
    private config: AppParamsConfig
  ){}

  getInventoryHistoriesByPage(
    searchDesc?: string,
    warehouseId?: number,
    pageNumber?: number,
    pageSize?: number): Observable<ResponseInventoryHistories> {

    if (searchDesc === undefined) {
      searchDesc = '';
    } else {
      searchDesc = filterString(searchDesc);
    }

    // this.apiUrl = `${this.config.urlInventoryHistories}/search/findByWarehouseId?` +
    //                 `warehouseId=${warehouseId}&itemName=${searchDesc}&page=${pageNumber}&size=${pageSize}`;

    this.apiUrl = `${this.config.urlInventoryHistories}/search/findByWarehouseId?` +
                    `warehouseId=${warehouseId}&page=${pageNumber}&size=${pageSize}`;
    return this.http.get<ResponseInventoryHistories>(this.apiUrl);

  }

  getInventoryHistoryItems(warehouseId: number) {

    this.apiUrl = `${this.config.urlV1InventoryHistories}/inventoryItems?warehouseId=${warehouseId}`;
    return this.http.get<InventoryItem>(this.apiUrl);

  }

}
