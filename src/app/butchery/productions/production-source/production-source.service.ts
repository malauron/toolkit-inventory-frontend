/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Warehouse } from 'src/app/classes/warehouse.model';
import { ButcheryProductionSource } from '../../classes/butchery-production-source.model';

@Injectable({
  providedIn: 'root',
})
export class ProductionSourceService{
  private _warehouse = new BehaviorSubject<Warehouse>(undefined);
  private _receivedItemDetail = new BehaviorSubject<ButcheryProductionSource>(undefined);

  get warehouse() {
    return this._warehouse;
  }

  get receivedItemDetail() {
    return this._receivedItemDetail;
  }
}
