import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Item } from 'src/app/classes/item.model';
import { AppParamsConfig } from 'src/app/Configurations/app-params.config';
import { ItemAddOnContent } from '../classes/item-add-on-content.model';
import { ItemAddOnDetail } from '../classes/item-add-on-detail.model';

@Injectable()
export class AddOnsServices {
  private item: Item;
  private itemAddOnDetails: ItemAddOnDetail[];
  private urlV1ItemAddOnDetails: string;
  private urlV1ItemAddOnContents: string;

  constructor(private http: HttpClient, private config: AppParamsConfig) {
    this.urlV1ItemAddOnDetails = `${this.config.urlV1}/itemAddOnDetails`;
    this.urlV1ItemAddOnContents = `${this.config.urlV1}/itemAddOnContents`;
  }

  setItem(item: Item) {
    this.item = item;
  }

  getItem() {
    return this.item;
  }

  addItemDetail(itemAddOnDetail: ItemAddOnDetail) {
    this.itemAddOnDetails = this.itemAddOnDetails.concat(itemAddOnDetail);
  }

  setItemAddOnDetails(itemAddOnDetails: ItemAddOnDetail[]) {
    this.itemAddOnDetails = itemAddOnDetails;
  }

  getItemAddOnDetails(): ItemAddOnDetail[] {
    return this.itemAddOnDetails;
  }

  postItemAddOnDetails(
    itemAddOnDetail: ItemAddOnDetail
  ): Observable<ItemAddOnDetail> {
    return this.http.post<ItemAddOnDetail>(
      this.urlV1ItemAddOnDetails,
      itemAddOnDetail
    );
  }

  postItemAddOnContents(
    itemAddOnContent: ItemAddOnContent
  ): Observable<ItemAddOnContent> {
    return this.http.post<ItemAddOnContent>(
      this.urlV1ItemAddOnContents,
      itemAddOnContent
    );
  }
}
