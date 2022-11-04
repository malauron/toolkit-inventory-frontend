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
import { Warehouse } from 'src/app/classes/warehouse.model';
import { AppParamsConfig } from 'src/app/Configurations/app-params.config';
import { ItemsService } from 'src/app/services/items.service';
import { WarehouseSearchComponent } from 'src/app/warehouses/warehouse-search/warehouse-search.component';

@Component({
  selector: 'app-inventories',
  templateUrl: './inventories.page.html',
  styleUrls: ['./inventories.page.scss'],
})
export class InventoriesPage implements OnInit, OnDestroy {
  @ViewChild('printButton') printButton: ElementRef;
  @ViewChild('infiniteScroll') infiniteScroll;
  @ViewChild('inventoryItemSearchBar', { static: true })
  inventoryItemSearchBar: IonSearchbar;

  inventoryItemSearchBarSub: Subscription;

  warehouse: Warehouse;
  totalAmt: number;

  itemCosts: ItemCost[] = [];
  itemCostsByPage: ItemCost[] = [];

  searchValue = '';

  pageNumber = 0;
  totalPages = 0;

  isFetching = false;
  modalOpen = false;

  constructor(
    private modalSearch: ModalController,
    private itemsService: ItemsService,
    private config: AppParamsConfig,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.warehouse = new Warehouse();

    this.inventoryItemSearchBarSub = this.inventoryItemSearchBar.ionInput
      .pipe(
        map((event) => (event.target as HTMLInputElement).value),
        debounceTime(this.config.waitTime),
        distinctUntilChanged()
      )
      .subscribe((res) => {
        if (this.warehouse.warehouseId) {
          this.searchValue = res.trim();
          this.infiniteScroll.disabled = false;
          this.itemCostsByPage = [];
          this.pageNumber = 0;
          this.totalPages = 0;
          this.getItemCostsByPage(
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

  onWarehouseSearch() {
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
            this.warehouse = resultData.data;
            // this.itemsService
            //   .getItemCosts(this.warehouse.warehouseId)
            //   .subscribe((res) => {
            //     this.itemCosts = [];
            //     this.itemCosts = this.itemCosts.concat(res);

            //     this.totalAmt = 0;
            //     this.itemCosts.forEach((itemCost) => {
            //       this.totalAmt += itemCost.qty * itemCost.cost;
            //     });
            //   });

            this.loadItemCosts(this.warehouse.warehouseId);

            this.infiniteScroll.disabled = false;
            this.itemCostsByPage = [];
            this.pageNumber = 0;
            this.totalPages = 0;
            this.getItemCostsByPage(
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

  loadItemCosts(warehouseId: number, print?: boolean) {
    this.itemsService.getItemCosts(warehouseId).subscribe((res) => {
      this.itemCosts = [];
      this.itemCosts = this.itemCosts.concat(res);

      this.totalAmt = 0;
      this.itemCosts.forEach((itemCost) => {
        this.totalAmt += itemCost.qty * itemCost.cost;
      });

      if (print) {
        this.printButton.nativeElement.click();
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
        this.itemCostsByPage = this.itemCostsByPage.concat(
          res._embedded.itemCosts
        );
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

    this.getItemCostsByPage(
      event,
      this.searchValue,
      this.warehouse.warehouseId,
      this.pageNumber,
      this.config.pageSize
    );
  }

  printPage() {
    // window.print();
    if (this.warehouse.warehouseId) {
      this.loadItemCosts(this.warehouse.warehouseId, true);
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
    this.inventoryItemSearchBarSub.unsubscribe();
  }
}
