/* eslint-disable no-underscore-dangle */
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IonSearchbar, ModalController, ViewDidEnter } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { VendorWarehouse } from 'src/app/classes/vendor-warehouse.model';
// import { Warehouse } from 'src/app/classes/warehouse.model';
import { AppParamsConfig } from 'src/app/Configurations/app-params.config';
import { VendorWarehousesService } from 'src/app/services/vendor-warehouses.service';

@Component({
  selector: 'app-warehouse-search',
  templateUrl: './vendor-warehouse-search.component.html',
  styleUrls: ['./vendor-warehouse-search.component.scss'],
})
export class VendorWarehouseSearchComponent implements OnInit, OnDestroy, ViewDidEnter {
  @ViewChild('infiniteScroll') infiniteScroll;
  @ViewChild('warehouseSearchBar', {static: true}) warehouseSearchBar: IonSearchbar;

  warehouseSearchBarSubscription: Subscription;

  warehouseList: VendorWarehouse[] = [];

  searchValue = '';

  pageNumber = 0;
  totalPages = 0;

  isFetching = false;

  constructor(
    private warehouseService: VendorWarehousesService,
    private config: AppParamsConfig,
    private modalController: ModalController
  ) { }

  ngOnDestroy(): void {
    this.warehouseSearchBarSubscription.unsubscribe();
  }

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
      this.warehouseList = this.warehouseList.concat(data._embedded.vendorWarehouses);
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

  onSelectWarehouse(warehouse: VendorWarehouse) {
    this.modalController.dismiss(warehouse, 'vendorWarehouse');
  }
}
