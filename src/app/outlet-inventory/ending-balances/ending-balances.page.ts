/* eslint-disable no-underscore-dangle */
import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import {
  AlertController,
  IonSearchbar,
  ModalController,
  ToastController,
} from '@ionic/angular';
import { Subscription } from 'rxjs/internal/Subscription';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { Warehouse } from 'src/app/classes/warehouse.model';
import { AppParamsConfig } from 'src/app/Configurations/app-params.config';
import { WarehouseSearchComponent } from 'src/app/warehouses/warehouse-search/warehouse-search.component';
import { InventoryItemDto } from '../classes/inventory-item-dto.model';
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

  inventoryItems: InventoryItemDto[] = [];

  searchValue = '';

  qty = 0;
  pageNumber = 0;
  totalPages = 0;

  isFetching = false;
  modalOpen = false;

  constructor(
    private router: Router,
    private modalSearch: ModalController,
    private inventoryItemsService: InventoryItemsService,
    private config: AppParamsConfig,
    private toastController: ToastController,
    private alertCtrl: AlertController
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
        res._embedded.inventoryItems.forEach((item) => {
          const invItem = new InventoryItemDto();
          invItem.inventoryItemId = item.inventoryItemId;
          invItem.item = item.item;
          invItem.warehouse = item.warehouse;
          invItem.beginningQty = item.beginningQty;
          invItem.purchasedQty = item.purchasedQty;
          invItem.endingQty = item.endingQty;
          invItem.cost = item.cost;
          invItem.price = item.price;
          invItem.qty = 0.0;
          invItem.isUpdateQty = false;
          invItem.isUpdatePrice = false;
          this.inventoryItems = this.inventoryItems.concat(invItem);
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

    this.getInventoryItemsByPage(
      event,
      this.searchValue,
      this.warehouse.warehouseId,
      this.pageNumber,
      this.config.pageSize
    );
  }

  onAddDeductQty(invItem: InventoryItemDto) {
    if (invItem.isUpdateQty) {
      return;
    }
    if (invItem.qty === undefined) {
      this.messageBox('Please enter a valid number.');
      return;
    }
    if (invItem.qty === null) {
      this.messageBox('Please enter a valid number.');
      return;
    }
    if (isNaN(invItem.qty)) {
      this.messageBox('Please enter a valid number.');
      return;
    }
    if (invItem.qty === 0) {
      this.messageBox('Please enter a number other than zero.');
      return;
    }
    if (invItem.beginningQty <=0 && invItem.purchasedQty <=0) {
      this.messageBox('Item has no beginning quantity and purchases.');
      return;
    }
    invItem.isUpdateQty = true;
    this.inventoryItemsService.setEndingQty(invItem).subscribe(
      (res) => {
        invItem.endingQty = invItem.endingQty + invItem.qty;
        invItem.qty = 0;
        invItem.isUpdateQty = false;
      },
      (err) => {
        this.messageBox('Unable to communicate with the server.');
        invItem.isUpdateQty = false;
      }
    );
  }

  onUpdatePrice(invItem: InventoryItemDto) {
    if (invItem.isUpdatePrice) {
      return;
    }
    if (invItem.price === undefined) {
      this.messageBox('Please enter a valid number.');
      return;
    }
    if (invItem.price === null) {
      this.messageBox('Please enter a valid number.');
      return;
    }
    if (isNaN(invItem.price)) {
      this.messageBox('Please enter a valid number.');
      return;
    }
    if (invItem.price < 0) {
      this.messageBox('Please enter a number greater than or equal to zero.');
      return;
    }
    invItem.isUpdatePrice = true;
    this.inventoryItemsService.setPrice(invItem).subscribe(
      (res) => {
        this.messageBox('Price has been updated successfully.');
        invItem.isUpdatePrice = false;
      },
      (err) => {
        this.messageBox('Unable to communicate with the server.');
        invItem.isUpdatePrice = false;
      }
    );
  }

  onFinalizeInventory() {

    if (this.isFetching) {
      return;
    }

    if (this.warehouse.warehouseId !== undefined) {
    console.log(this.isFetching);
      this.alertCtrl.create({
        header: 'Confirm',
        message:
          'This will finalize ' + this.warehouse.warehouseName + ' inventory.',
        buttons: [
          {
            text: 'Cancel',
          },
          {
            text: 'Finalize',
            handler: () => {
              this.isFetching = true;
              this.infiniteScroll.disabled = false;
              this.inventoryItems = [];
              this.pageNumber = 0;
              this.totalPages = 0;

              const invItem = new InventoryItemDto();

              invItem.warehouse = this.warehouse;

              this.inventoryItemsService.setQty(invItem).subscribe(
                (res) => {
                  this.getInventoryItemsByPage(
                    undefined,
                    undefined,
                    this.warehouse.warehouseId,
                    this.pageNumber,
                    this.config.pageSize
                  );
                },
                (err) => {
                  this.isFetching = false;
                }
              );

            },
          },
        ],
      })
      .then(res => {
        res.present();
      });
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
