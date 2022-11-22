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
import { Warehouse } from 'src/app/classes/warehouse.model';
import { AppParamsConfig } from 'src/app/Configurations/app-params.config';
import { WarehouseSearchComponent } from 'src/app/warehouses/warehouse-search/warehouse-search.component';
import { InventoryItemDto } from '../classes/inventory-item-dto.model';
import { InventoryItem } from '../classes/inventory-item.model';
import { InventoryItemsService } from '../services/inventory-items.service';

@Component({
  selector: 'app-ending-balances',
  templateUrl: './ending-balances.page.html',
  styleUrls: ['./ending-balances.page.scss'],
})
export class EndingBalancesPage implements OnInit, OnDestroy {
  @ViewChild('printButton') printButton: ElementRef;
  @ViewChild('infiniteScroll') infiniteScroll;
  @ViewChild('inventoryItemSearchBar', { static: true })
  inventoryItemSearchBar: IonSearchbar;

  inventoryItemSearchBarSub: Subscription;

  warehouse: Warehouse;
  totalAmt: number;

  // itemCosts: ItemCost[] = [];
  inventoryItems: InventoryItemDto[] = [];

  searchValue = '';

  qty = 0;
  pageNumber = 0;
  totalPages = 0;

  isFetching = false;
  modalOpen = false;

  constructor(
    private modalSearch: ModalController,
    private inventoryItemsService: InventoryItemsService,
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
          this.inventoryItems = [];
          this.pageNumber = 0;
          this.totalPages = 0;
          this.getInventoryItemsByPage(
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
            this.isFetching = true;
            this.warehouse = resultData.data;

            // this.loadItemCosts(this.warehouse.warehouseId);

            this.infiniteScroll.disabled = false;
            this.inventoryItems = [];
            this.pageNumber = 0;
            this.totalPages = 0;
            this.getInventoryItemsByPage(
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

  // loadItemCosts(warehouseId: number, print?: boolean) {
  //   this.itemsService.getItemCosts(warehouseId).subscribe((res) => {
  //     this.itemCosts = [];
  //     this.itemCosts = this.itemCosts.concat(res);

  //     this.totalAmt = 0;
  //     this.itemCosts.forEach((itemCost) => {
  //       this.totalAmt += itemCost.qty * itemCost.cost;
  //     });

  //     if (print) {
  //       setTimeout(() => {
  //         this.printButton.nativeElement.click();
  //         this.isFetching = false;
  //       }, 2000);
  //     }
  //   });
  // }

  getInventoryItemsByPage(
    event?,
    searchDesc?: string,
    warehouseId?: number,
    pageNumber?: number,
    pageSize?: number
  ) {
    this.isFetching = true;
    this.inventoryItemsService
      .getInventoryItemsByPage(searchDesc, warehouseId, pageNumber, pageSize)
      .subscribe((res) => {

        res._embedded.inventoryItems.forEach(item => {
          console.log(item);
          const invItem = new InventoryItemDto();
          invItem.inventoryItemId = item.inventoryItemId;
          invItem.item = item.item;
          invItem.warehouse = item.warehouse;
          invItem.beginningQty = item.beginningQty;
          invItem.purchasedQty = item.purchasedQty;
          invItem.endingQty = item.endingQty;
          invItem.cost = item.cost;
          invItem.price = item.price;
          invItem.qty = 0.00;
          this.inventoryItems = this.inventoryItems.concat(invItem);
        });
        // this.inventoryItems = this.inventoryItems.concat(
        //   res._embedded.inventoryItems
        // );
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

    this.getInventoryItemsByPage(
      event,
      this.searchValue,
      this.warehouse.warehouseId,
      this.pageNumber,
      this.config.pageSize
    );
  }

  onAddDeductQty(invItem: InventoryItemDto) {
    console.log(invItem);
  }

  // printPage() {
  //   if (this.warehouse.warehouseId) {
  //     if (!this.isFetching) {
  //       this.isFetching = true;
  //       this.loadItemCosts(this.warehouse.warehouseId, true);
  //     }
  //   } else {
  //     this.messageBox('Please select a warehouse.');
  //   }
  // }

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
