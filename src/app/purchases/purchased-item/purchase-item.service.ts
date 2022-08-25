/* eslint-disable no-underscore-dangle */
import { BehaviorSubject } from 'rxjs';
import { PurchaseItemDetail } from './purchase-item.model';

export class PurchaseItemService{
  private _purchaseItemDetail = new BehaviorSubject<PurchaseItemDetail>(undefined);

  get purchaseItemDetail() {
    return this._purchaseItemDetail;
  }
}
