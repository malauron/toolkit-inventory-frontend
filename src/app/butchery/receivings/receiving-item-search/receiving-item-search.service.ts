/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Warehouse } from 'src/app/classes/warehouse.model';

@Injectable({
  providedIn: 'root',
})
export class ReceivingItemSearchService{
  private _warehouse = new BehaviorSubject<Warehouse>(undefined);

  get warehouse() {
    return this._warehouse;
  }
}
