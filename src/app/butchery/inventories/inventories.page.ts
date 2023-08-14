/* eslint-disable no-underscore-dangle */
import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { IonSearchbar, ModalController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs/internal/Subscription';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { ItemCost } from 'src/app/classes/item-cost.model';
import { VendorWarehouse } from 'src/app/classes/vendor-warehouse.model';
import { Warehouse } from 'src/app/classes/warehouse.model';
import { AppParamsConfig } from 'src/app/Configurations/app-params.config';
import { ItemsService } from 'src/app/services/items.service';
import { VendorWarehouseSearchComponent } from 'src/app/vendor-warehouses/vendor-warehouse-search/vendor-warehouse-search.component';
import { WarehouseSearchComponent } from 'src/app/warehouses/warehouse-search/warehouse-search.component';
import { ButcheryBatchInventory } from '../classes/butchery-batch-inventory.model';
import { ButcheryBatchesService } from '../services/butchery-batches.service';

@Component({
  selector: 'app-inventories',
  templateUrl: './inventories.page.html',
  styleUrls: ['./inventories.page.scss'],
})
export class InventoriesPage implements OnInit, OnDestroy {
  @ViewChild('printButton') printButton: ElementRef;
  @ViewChild('infiniteScroll') infiniteScroll;
  @ViewChild('itemSearchBar', { static: true }) itemSearchBar: IonSearchbar;

  itemSearchBarSub: Subscription;

  warehouse: Warehouse;
  vendorWarehouse: VendorWarehouse;
  totalAmt: number;

  itemCosts: ItemCost[] = [];
  itemCostsByPage: ItemCost[] = [];
  butcheryBatchInventories: ButcheryBatchInventory[] = [];

  currentSearch = 'storage_provider';
  currentWarehouse = '';
  searchValue = '';

  pageNumberWH = 0;
  totalPagesWH = 0;
  pageSizeWH = 20;

  pageNumberSP = 0;
  totalPagesSP = 0;
  pageSizeSP = 20;

  isFetching = false;
  modalOpen = false;

  constructor(
    private modalSearch: ModalController,
    private itemsService: ItemsService,
    private butcheryBatchService: ButcheryBatchesService,
    private config: AppParamsConfig,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.warehouse = new Warehouse();
    this.vendorWarehouse = new VendorWarehouse();

    this.itemSearchBarSub = this.itemSearchBar.ionInput
      .pipe(
        map((event) => (event.target as HTMLInputElement).value),
        debounceTime(this.config.waitTime),
        distinctUntilChanged()
      )
      .subscribe((res) => {
        if (this.currentSearch === 'warehouse') {
          if (this.warehouse.warehouseId) {
            this.searchValue = res.trim();
            this.infiniteScroll.disabled = false;
            this.itemCostsByPage = [];
            this.pageNumberWH = 0;
            this.totalPagesWH = 0;
            this.getItemCostsByPage(
              undefined,
              this.searchValue,
              this.warehouse.warehouseId,
              this.pageNumberWH,
              this.pageSizeWH
            );
          }
        } else {
          if (this.vendorWarehouse.vendorWarehouseId) {
            this.searchValue = res.trim();
            this.infiniteScroll.disabled = false;
            this.butcheryBatchInventories = [];
            this.pageNumberSP = 0;
            this.totalPagesSP = 0;
            this.getButcheryBatchInventorySummary(
              undefined,
              this.pageNumberSP,
              this.pageSizeSP,
              this.vendorWarehouse.vendorWarehouseId,
              this.searchValue
            );
          }
        }
      });
  }

  segmentChanged(event) {
    this.currentSearch = event.detail.value;
    this.currentWarehouse = '';
    if (this.currentSearch === 'warehouse') {
      if (this.warehouse.warehouseName !== undefined) {
        this.currentWarehouse = this.warehouse.warehouseName;
      }
    } else {
      if (this.vendorWarehouse.vendorWarehouseName !== undefined) {
        this.currentWarehouse = this.vendorWarehouse.vendorWarehouseName;
      }
    }
  }

  getComponentRef() {
    if (this.currentSearch === 'warehouse') {
      return { component: WarehouseSearchComponent };
    } else {
      return { component: VendorWarehouseSearchComponent };
    }
  }

  onWarehouseSearch() {
    if (!this.modalOpen) {
      this.modalOpen = true;

      this.modalSearch
        .create(this.getComponentRef())
        .then((modalSearch) => {
          modalSearch.present();
          return modalSearch.onDidDismiss();
        })
        .then((resultData) => {
          this.isFetching = true;
          this.infiniteScroll.disabled = false;

          if (resultData.role === 'warehouse') {
            this.warehouse = resultData.data;
            this.currentWarehouse = this.warehouse.warehouseName;
            this.loadItemCosts(this.warehouse.warehouseId);
            this.itemCostsByPage = [];
            this.pageNumberWH = 0;
            this.totalPagesWH = 0;
            this.getItemCostsByPage(
              undefined,
              this.searchValue,
              this.warehouse.warehouseId,
              this.pageNumberWH,
              this.pageSizeWH
            );
          } else if (resultData.role === 'vendorWarehouse') {
            this.vendorWarehouse = resultData.data;
            this.currentWarehouse = this.vendorWarehouse.vendorWarehouseName;
            this.butcheryBatchInventories = [];
            this.pageNumberSP = 0;
            this.totalPagesSP = 0;
            this.getButcheryBatchInventorySummary(
              undefined,
              this.pageNumberSP,
              this.pageSizeSP,
              this.vendorWarehouse.vendorWarehouseId,
              this.searchValue
            );
          } else {
            this.isFetching = false;
          }
          this.modalOpen = false;
        });
    }
  }

  loadItemCosts(warehouseId: number, print?: boolean) {
    this.itemsService.getItemCosts(warehouseId).subscribe((res) => {
      this.itemCosts = [];
      this.itemCosts = this.itemCosts.concat(res);

      this.totalAmt = 0;
      this.itemCosts.forEach((itemCost) => {
        this.totalAmt += itemCost.qty * itemCost.cost;
      });

      if (print) {
        setTimeout(() => {
          this.printButton.nativeElement.click();
          this.isFetching = false;
        }, 2000);
      }
    });
  }

  getItemCostsByPage(
    event?,
    searchDesc?: string,
    warehouseId?: number,
    pageNumber?: number,
    pageSize?: number
  ) {
    this.isFetching = true;
    this.itemsService
      .getItemCostsByPage(searchDesc, warehouseId, pageNumber, pageSize)
      .subscribe((res) => {
        console.log(res);
        this.itemCostsByPage = this.itemCostsByPage.concat(
          res._embedded.itemCosts
        );
        this.totalPagesWH = res.page.totalPages;
        this.isFetching = false;
        if (event) {
          event.target.complete();
        }
        this.infiniteScroll.disabled = false;
      });
  }

  getButcheryBatchInventorySummary(
    event?,
    pageNumber?: number,
    pageSize?: number,
    vendorWarehouseId?: number,
    searchDesc?: string
  ) {
    this.isFetching = true;
    this.butcheryBatchService
      .getButcheryBatchInventorySummaryByVendorWarehouseId(
        pageNumber,
        pageSize,
        vendorWarehouseId,
        searchDesc
      )
      .subscribe((res) => {
        this.butcheryBatchInventories = this.butcheryBatchInventories.concat(
          res.content
        );
        this.totalPagesSP = res.totalPages;
        this.isFetching = false;
        if (event) {
          event.target.complete();
        }
        this.infiniteScroll.disabled = false;
      });
  }

  loadMoreData(event) {
    if (this.currentSearch === 'warehouse') {
      if (this.pageNumberWH + 1 >= this.totalPagesWH) {
        event.target.disabled = true;
        return;
      }

      this.pageNumberWH++;

      this.getItemCostsByPage(
        event,
        this.searchValue,
        this.warehouse.warehouseId,
        this.pageNumberWH,
        this.pageSizeWH
      );
    } else {
      if (this.pageNumberSP + 1 >= this.totalPagesSP) {
        event.target.disabled = true;
        return;
      }

      this.pageNumberSP++;

      this.getButcheryBatchInventorySummary(
        event,
        this.pageNumberSP,
        this.pageSizeSP,
        this.vendorWarehouse.vendorWarehouseId,
        this.searchValue
      );
    }
  }

  printPage() {
    if (this.warehouse.warehouseId) {
      if (!this.isFetching) {
        this.isFetching = true;
        this.loadItemCosts(this.warehouse.warehouseId, true);
      }
    } else {
      this.messageBox('Please select a warehouse.');
    }
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
    this.itemSearchBarSub.unsubscribe();
  }
}
