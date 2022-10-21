/* eslint-disable no-underscore-dangle */
import { BehaviorSubject } from 'rxjs';
import { ReceivedItemDetail } from './received-item.model';

export class ReceivedItemService{
  private _receivedItemDetail = new BehaviorSubject<ReceivedItemDetail>(undefined);

  get receivedItemDetail() {
    return this._receivedItemDetail;
  }
}
