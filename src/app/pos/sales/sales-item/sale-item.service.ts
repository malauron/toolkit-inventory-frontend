/* eslint-disable no-underscore-dangle */
import { BehaviorSubject } from 'rxjs';
import { SaleItemDetail } from './sale-item.model';

export class SaleItemService {
  private _saleItemDetail = new BehaviorSubject<SaleItemDetail>(undefined);

  get saleItemDetail() {
    return this._saleItemDetail;
  }
}
