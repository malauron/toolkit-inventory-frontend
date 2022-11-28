/* eslint-disable no-underscore-dangle */
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, IonSearchbar, ModalController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { Warehouse } from 'src/app/classes/warehouse.model';
import { AppParamsConfig } from 'src/app/Configurations/app-params.config';
import { WarehouseSearchComponent } from 'src/app/warehouses/warehouse-search/warehouse-search.component';
import { InventoryItemDto } from '../classes/inventory-item-dto.model';
import { InventoryHistoriesService } from '../services/inventory-histories.service';
import { InventoryHistory } from '../classes/inventory-history.model';

@Component({
  selector: 'app-inventory-history',
  templateUrl: './inventory-history.page.html',
  styleUrls: ['./inventory-history.page.scss'],
})
export class InventoryHistoryPage implements OnInit, OnDestroy {
  @ViewChild('printButton') printButton: ElementRef;
  @ViewChild('infiniteScroll') infiniteScroll;
  @ViewChild('searchBar', { static: true })
  searchBar: IonSearchbar;

  searchBarSub: Subscription;

  warehouse: Warehouse;

  totalAmt: number;

  inventoryHistories: InventoryHistory[] = [];

  searchValue = '';

  qty = 0;
  pageNumber = 0;
  totalPages = 0;

  isFetching = false;
  modalOpen = false;

  constructor(
    private router: Router,
    private modalSearch: ModalController,
    private inventoryHistoriesService: InventoryHistoriesService,
    private config: AppParamsConfig,
    private toastController: ToastController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.warehouse = new Warehouse();

    this.searchBarSub = this.searchBar.ionInput
      .pipe(
        map((event) => (event.target as HTMLInputElement).value),
        debounceTime(this.config.waitTime),
        distinctUntilChanged()
      )
      .subscribe((res) => {
        if (this.warehouse.warehouseId) {
          this.searchValue = res.trim();
          this.infiniteScroll.disabled = false;
          this.inventoryHistories = [];
          this.pageNumber = 0;
          this.totalPages = 0;
          this.getInventoryHistories(
            undefined,
            this.searchValue,
            this.warehouse.warehouseId,
            this.pageNumber,
            this.config.pageSize
          );
        } else {
          console.log('no data');
        }
      });
  }

  onPrintView() {
    if (this.warehouse.warehouseId === undefined) {
      this.messageBox('Please select a warehouse.');
      return;
    }
    this.router.navigate([
      '/',
      'tabs',
      'ending-balances',
      'inventory-print-view',
      this.warehouse.warehouseId,
    ]);
  }

  onWarehouseSearch() {
    if (this.isFetching) {
      return;
    }

    if (!this.modalOpen) {
      this.modalOpen = true;
      this.modalSearch
        .create({ component: WarehouseSearchComponent })
        .then((modalSearch) => {
          modalSearch.present();
          return modalSearch.onDidDismiss();
        })
        .then((resultData) => {
          if (resultData.role === 'warehouse') {
            this.isFetching = true;
            this.warehouse = resultData.data;

            this.infiniteScroll.disabled = false;
            this.inventoryHistories = [];
            this.pageNumber = 0;
            this.totalPages = 0;
            this.getInventoryHistories(
              undefined,
              this.searchValue,
              this.warehouse.warehouseId,
              this.pageNumber,
              this.config.pageSize
            );
          }
          this.modalOpen = false;
        });
    }
  }

  getInventoryHistories(
    event?,
    searchDesc?: string,
    warehouseId?: number,
    pageNumber?: number,
    pageSize?: number
  ) {
    this.isFetching = true;
    this.inventoryHistoriesService
      .getInventoryHistoriesByPage(searchDesc, warehouseId, pageNumber, pageSize)
      .subscribe((res) => {
        res._embedded.inventoryHistories.forEach((item) => {
          const invItem = new InventoryItemDto();
          this.inventoryHistories = this.inventoryHistories.concat(res._embedded.inventoryHistories);
        });
        this.totalPages = res.page.totalPages;
        this.isFetching = false;
        if (event) {
          event.target.complete();
        }
        this.infiniteScroll.disabled = false;
      });
  }

  loadMoreData(event) {
    if (this.pageNumber + 1 >= this.totalPages) {
      event.target.disabled = true;
      return;
    }

    this.pageNumber++;

    this.getInventoryHistories(
      event,
      this.searchValue,
      this.warehouse.warehouseId,
      this.pageNumber,
      this.config.pageSize
    );
  }

  async messageBox(messageDescription: string) {
    const toast = await this.toastController.create({
      color: 'dark',
      duration: 2000,
      position: 'top',
      message: messageDescription,
    });
    await toast.present();
  }

  ngOnDestroy(): void {
    this.searchBarSub.unsubscribe();
  }
}

