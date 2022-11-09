/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ReceivedItemDetail } from './received-item.model';

@Injectable({
  providedIn: 'root',
})
export class ReceivedItemService{
  private _receivedItemDetail = new BehaviorSubject<ReceivedItemDetail>(undefined);

  get receivedItemDetail() {
    return this._receivedItemDetail;
  }
}
