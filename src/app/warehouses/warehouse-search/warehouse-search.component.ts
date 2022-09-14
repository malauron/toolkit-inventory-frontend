/* eslint-disable no-underscore-dangle */
import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSearchbar, ModalController, ViewDidEnter } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { Warehouse } from 'src/app/classes/warehouse.model';
import { AppParamsConfig } from 'src/app/Configurations/app-params.config';
import { WarehousesService } from 'src/app/services/warehouses.service';

@Component({
  selector: 'app-warehouse-search',
  templateUrl: './warehouse-search.component.html',
  styleUrls: ['./warehouse-search.component.scss'],
})
export class WarehouseSearchComponent implements OnInit, ViewDidEnter {
  @ViewChild('infiniteScroll') infiniteScroll;
  @ViewChild('warehouseSearchBar', {static: true}) warehouseSearchBar: IonSearchbar;

  warehouseSearchBarSubscription: Subscription;

  warehouseList: Warehouse[] = [];

  searchValue = '';

  pageNumber = 0;
  totalPages = 0;

  isFetching = false;

  constructor(
    private warehouseService: WarehousesService,
    private config: AppParamsConfig,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.warehouseSearchBarSubscription = this.warehouseSearchBar.ionInput
      .pipe(
        map((event) => (event.target as HTMLInputElement).value),
        debounceTime(this.config.waitTime),
        distinctUntilChanged()
      )
      .subscribe((res) => {
        this.searchValue = res.trim();
        this.infiniteScroll.disabled = false;
        this.warehouseList = [];
        this.pageNumber = 0;
        this.totalPages = 0;
        if (this.searchValue) {
          this.getWarehouses(undefined, 0, this.config.pageSize, this.searchValue);
        } else {
          this.getWarehouses(undefined, 0, this.config.pageSize);
        }
      });
  }

  ionViewDidEnter(): void {
      setTimeout(() => {
        this.warehouseSearchBar.setFocus();
      }, 5);
  }

  getWarehouses(
    event?,
    pageNumber?: number,
    pageSize?: number,
    warehouseName?: string
  ) {
    this.isFetching = true;

    if (warehouseName === undefined) {
      this.warehouseService
        .getWarehouses(pageNumber, pageSize)
        .subscribe(this.procressResult(event), (error) => {
          this.isFetching = false;
        });
    } else {
      this.warehouseService
        .getWarehouses(pageNumber, pageSize, warehouseName)
        .subscribe(this.procressResult(event), (error) => {
          this.isFetching = false;
        });
    }
  }

  procressResult(event?) {
    return(data) => {
      this.warehouseList = this.warehouseList.concat(data._embedded.warehouses);
      this.totalPages = data.page.totalPages;
      this.isFetching = false;
      if (event) {
        event.target.complete();
      }
    };
  }

  loadMoreWarehouses(event) {
    if (this.pageNumber + 1 >= this.totalPages) {
      event.target.disabled = true;
      return;
    }

    this.pageNumber++;

    if (this.searchValue) {
      this.getWarehouses(
        event,
        this.pageNumber,
        this.config.pageSize,
        this.searchValue
      );
    } else {
      this.getWarehouses(event, this.pageNumber, this.config.pageSize);
    }
  }

  dismissModal() {
    this.modalController.dismiss(null, 'dismissModal');
  }

  onSelectWarehouse(warehouse: Warehouse) {
    this.modalController.dismiss(warehouse, 'warehouse');
  }
}
