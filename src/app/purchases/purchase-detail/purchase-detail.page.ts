import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  AlertController,
  IonPopover,
  ModalController,
  NavController,
  ToastController,
} from '@ionic/angular';
import { PurchaseDto } from 'src/app/classes/purchase-dto.model';
import { PurchaseItem } from 'src/app/classes/purchase-item.model';
import { Purchase } from 'src/app/classes/purchase.model';
import { Vendor } from 'src/app/classes/vendor.model';
import { Warehouse } from 'src/app/classes/warehouse.model';
import { PurchaseDetailsConfig } from 'src/app/Configurations/purchase-details.config';
import { PurchasesService } from 'src/app/services/purchases.service';
import { VendorSearchComponent } from 'src/app/vendors/vendor-search/vendor-search.component';
import { WarehouseSearchComponent } from 'src/app/warehouses/warehouse-search/warehouse-search.component';
import { PurchaseItemDetail } from '../purchased-item/purchase-item.model';
import { PurchaseItemService } from '../purchased-item/purchase-item.service';
import { PurchasedItemComponent } from '../purchased-item/purchased-item.component';

@Component({
  selector: 'app-purchase-detail',
  templateUrl: './purchase-detail.page.html',
  styleUrls: ['./purchase-detail.page.scss'],
})
export class PurchaseDetailPage implements OnInit, OnDestroy {
  @ViewChild('statusPopover') statusPopover: IonPopover;
  statusPopoverOpen = false;

  purchase: Purchase;
  vendor = new Vendor();
  warehouse: Warehouse;
  purchaseItems: PurchaseItem[] = [];
  purchaseDetailsConfig: PurchaseDetailsConfig;

  isUploading = false;
  dataHaveChanged = false;
  isFetching = false;
  modalOpen = false;

  totalAmt = 0;

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private purchaseService: PurchasesService,
    private purchaseItemService: PurchaseItemService,
    private modalSearch: ModalController,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.isFetching = true;

    this.purchase = new Purchase();

    this.warehouse = new Warehouse();

    this.purchaseDetailsConfig = new PurchaseDetailsConfig();

    this.route.paramMap.subscribe((paramMap) => {
      if (!paramMap.has('purchaseId')) {
        this.navCtrl.navigateBack('/tabs/purchases');
        return;
      }

      if (isNaN(Number(paramMap.get('purchaseId')))) {
        this.navCtrl.navigateBack('/tabs/purchases');
        return;
      }

      const purchaseId = Number(paramMap.get('purchaseId'));
      if (purchaseId > 0) {
        this.purchaseService.getPurchase(purchaseId).subscribe(
          (resData) => {
            if (!resData.purchaseId) {
              this.navCtrl.navigateBack('/tabs/purchases');
              return;
            }
            this.purchase.purchaseId = resData.purchaseId;
            this.purchase.totalAmt = resData.totalAmt;
            this.purchase.purchaseStatus = resData.purchaseStatus;
            this.purchaseDetailsConfig.setParams(resData.purchaseStatus);
            this.purchase.dateCreated = resData.dateCreated;
            this.vendor = resData.vendor;
            this.warehouse = resData.warehouse;
            this.purchaseItems = resData.purchaseItems;
            this.totalAmt = this.purchase.totalAmt;
            this.isFetching = false;
          },
          (err) => {
            this.navCtrl.navigateBack('/tabs/purchases');
            return;
          }
        );
      } else {
        this.isFetching = false;
      }
    });
  }

  onUpdateStatus(newStatus: string) {
    if (!this.isUploading) {
      this.isUploading = true;
      const purchaseDto = new PurchaseDto();

      purchaseDto.purchaseId = this.purchase.purchaseId;
      purchaseDto.purchaseStatus = newStatus;

      this.purchaseService.putPurchaseSetStatus(purchaseDto).subscribe(
        (res) => {
          this.dataHaveChanged = true;
          if (res.purchaseStatus === 'Unposted') {
            this.purchase.purchaseStatus = newStatus;
            this.purchaseDetailsConfig.setParams(newStatus);
            this.messageBox(
              `Purchase has been ${newStatus.toLowerCase()} successfully.`
            );
          } else {
            this.purchase.purchaseStatus = res.purchaseStatus;
            this.purchaseDetailsConfig.setParams(res.purchaseStatus);
            this.messageBox(
              'Unable to update the purchase since its status has been tagged as ' +
                this.purchase.purchaseStatus
            );
          }
          this.isUploading = false;
        },
        (err) => {
          this.dataHaveChanged = true;
          this.messageBox(
            'An error occured while trying to update the purchase detail.'
          );
          this.isUploading = false;
        }
      );
    }
  }

  onCustomerSearch() {
    if (!this.modalOpen) {
      this.modalOpen = true;
      this.modalSearch
        .create({ component: VendorSearchComponent })
        .then((modalSearch) => {
          modalSearch.present();
          return modalSearch.onDidDismiss();
        })
        .then((resultData) => {
          if (resultData.role === 'vendor') {
            if (this.purchase.purchaseId) {
              const purchaseDto = new PurchaseDto();
              purchaseDto.purchaseId = this.purchase.purchaseId;
              purchaseDto.vendor = resultData.data;
              this.dataHaveChanged = true;

              this.purchaseService.putPurchase(purchaseDto).subscribe((res) => {
                this.purchase.purchaseStatus = res.purchaseStatus;
                if (this.purchase.purchaseStatus === 'Unposted') {
                  this.vendor = resultData.data;
                  this.messageBox(
                    'You have successfully assigned a new vendor.'
                  );
                } else {
                  this.messageBox(
                    'Unable to update the purchase since its status has been tagged as ' +
                      this.purchase.purchaseStatus
                  );
                }
              });
            } else {
              this.vendor = resultData.data;
            }
          }
          this.modalOpen = false;
        });
    }
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
            if (this.purchase.purchaseId) {
              const purchaseDto = new PurchaseDto();
              purchaseDto.purchaseId = this.purchase.purchaseId;
              purchaseDto.warehouse = resultData.data;
              this.dataHaveChanged = true;

              this.purchaseService.putPurchase(purchaseDto).subscribe((res) => {
                this.purchase.purchaseStatus = res.purchaseStatus;
                if (this.purchase.purchaseStatus === 'Unposted') {
                  this.warehouse = resultData.data;
                  this.messageBox(
                    `Purchased items will be delivered to ${this.warehouse.warehouseName}.`
                  );
                } else {
                  this.messageBox(
                    'Unable to update the purchase since its status has been tagged as ' +
                      this.purchase.purchaseStatus
                  );
                }
              });
            } else {
              this.warehouse = resultData.data;
            }
          }
          this.modalOpen = false;
        });
    }
  }

  onAddPurchasedItem() {
    if (!this.modalOpen) {
      this.modalOpen = true;
      this.purchaseItemService.purchaseItemDetail.next(undefined);
      this.modalSearch
        .create({ component: PurchasedItemComponent })
        .then((modalSearch) => {
          modalSearch.present();
          return modalSearch.onDidDismiss();
        })
        .then((resultData) => {
          if (resultData.role === 'item') {
            const item: PurchaseItemDetail = resultData.data;
            const purchaseItem = new PurchaseItem();

            purchaseItem.item = item.item;
            purchaseItem.requiredUom = item.uom;
            purchaseItem.purchasedQty = item.quantity;
            purchaseItem.purchasePrice = item.price;
            purchaseItem.totalAmount = item.quantity * item.price;

            if (this.purchase.purchaseId) {
              purchaseItem.purchase = this.purchase;
              this.purchaseService
                .putPurchaseItem(purchaseItem)
                .subscribe((res) => {
                  this.dataHaveChanged = true;
                  this.purchase.purchaseStatus = res.purchaseStatus;
                  if (this.purchase.purchaseStatus === 'Unposted') {
                    this.purchaseItems = this.purchaseItems.concat(
                      res.purchaseItem
                    );
                    this.getTotalAmt();
                    this.messageBox('New purchased item has been added.');
                  } else {
                    this.messageBox(
                      'Unable to update the purchase since its status has been tagged as ' +
                        this.purchase.purchaseStatus
                    );
                  }
                });
            } else {
              this.purchaseItems = this.purchaseItems.concat(purchaseItem);
              this.getTotalAmt();
            }
          }
          this.modalOpen = false;
        });
    }
  }

  onSavePurchase() {
    if (this.vendor.vendorId === undefined) {
      this.messageBox('Please provide a vendor');
      return;
    }

    if (!this.warehouse.warehouseId) {
      this.messageBox('Please choose a warehouse.');
      return;
    }

    if (this.purchaseItems.length <= 0) {
      this.messageBox('Please provide at least 1 purchased item.');
      return;
    }

    const purchaseDto = new PurchaseDto();

    purchaseDto.totalAmt = this.totalAmt;
    purchaseDto.vendor = this.vendor;
    purchaseDto.warehouse = this.warehouse;
    purchaseDto.purchaseItems = this.purchaseItems;

    this.purchaseService
      .postPurhcase(purchaseDto)
      .subscribe(this.onProcessSavedPurchase());
  }

  onProcessSavedPurchase() {
    return (res: Purchase) => {
      this.purchase.purchaseId = res.purchaseId;
      this.purchase.purchaseStatus = res.purchaseStatus;
      this.purchaseDetailsConfig.setParams(res.purchaseStatus);
      this.purchase.dateCreated = res.dateCreated;
      this.purchaseItems = res.purchaseItems;
      this.dataHaveChanged = true;
    };
  }

  onUpdatePurchaseItem(pItem?: PurchaseItem) {
    if (!this.modalOpen) {
      this.modalOpen = true;

      const purchaseItemDetail = new PurchaseItemDetail();

      purchaseItemDetail.item = pItem.item;
      purchaseItemDetail.uom = pItem.requiredUom;
      purchaseItemDetail.quantity = pItem.purchasedQty;
      purchaseItemDetail.price = pItem.purchasePrice;

      this.purchaseItemService.purchaseItemDetail.next(purchaseItemDetail);

      this.modalSearch
        .create({ component: PurchasedItemComponent })
        .then((modalSearch) => {
          modalSearch.present();
          return modalSearch.onDidDismiss();
        })
        .then((resultData) => {
          if (resultData.role === 'item') {
            const item: PurchaseItemDetail = resultData.data;
            const purchaseItem = new PurchaseItem();

            purchaseItem.item = item.item;
            purchaseItem.requiredUom = item.uom;
            purchaseItem.purchasedQty = item.quantity;
            purchaseItem.purchasePrice = item.price;
            purchaseItem.totalAmount = item.quantity * item.price;


            if (this.purchase.purchaseId) {
              purchaseItem.purchaseItemId = pItem.purchaseItemId;
              purchaseItem.purchase = this.purchase;
              this.purchaseService
                .putPurchaseItem(purchaseItem)
                .subscribe((res) => {
                  this.dataHaveChanged = true;
                  this.purchase.purchaseStatus = res.purchaseStatus;
                  if (this.purchase.purchaseStatus === 'Unposted') {
                    this.updatePurchaseItemObj(pItem, purchaseItem);
                    this.getTotalAmt();
                    this.messageBox('Purchased item has been updated.');
                  } else {
                    this.messageBox(
                      'Unable to update the purchase since its status has been tagged as ' +
                        this.purchase.purchaseStatus
                    );
                  }
                });
            } else {
              this.updatePurchaseItemObj(pItem, purchaseItem);
              this.getTotalAmt();
            }
          }
          this.modalOpen = false;
        });
    }
  }

  updatePurchaseItemObj(pItem: PurchaseItem, purchaseItem: PurchaseItem) {
    for (const key in this.purchaseItems) {
      if (pItem === this.purchaseItems[key]) {
        this.purchaseItems[key].item = purchaseItem.item;
        this.purchaseItems[key].requiredUom = purchaseItem.requiredUom;
        this.purchaseItems[key].purchasedQty = purchaseItem.purchasedQty;
        this.purchaseItems[key].purchasePrice = purchaseItem.purchasePrice;
        this.purchaseItems[key].totalAmount  = purchaseItem.totalAmount;
      }
    }
  }

  onDeletePurchaseItem(pItem: PurchaseItem) {
    this.alertCtrl
      .create({
        header: 'Confirm',
        message: 'This will be deleted permanently .',
        buttons: [
          {
            text: 'Cancel',
          },
          {
            text: 'Delete',
            handler: () => {
              if (pItem.purchaseItemId !== undefined) {
                pItem.purchase = this.purchase;
                this.purchaseService
                  .deletePurchaseItem(pItem)
                  .subscribe((res) => {
                    this.dataHaveChanged = true;
                    this.purchase.purchaseStatus = res.purchaseStatus;
                    if (this.purchase.purchaseStatus === 'Unposted') {
                      this.removeMenuObj(pItem);
                      this.messageBox(
                        'Purchase item has been deleted successfully.'
                      );
                    } else {
                      this.messageBox(
                        'Unable to delete the purchase item since purchase has been tagged as ' +
                          this.purchase.purchaseStatus
                      );
                    }
                  });
              } else {
                this.removeMenuObj(pItem);
              }
            },
          },
        ],
      })
      .then((res) => {
        res.present();
      });
  }

  removeMenuObj(pItem: PurchaseItem) {
    for (const key in this.purchaseItems) {
      if (pItem === this.purchaseItems[key]) {
        this.purchaseItems.splice(Number(key), 1);
      }
    }
    this.getTotalAmt();
  }

  getTotalAmt() {
    this.totalAmt = 0;
    this.purchaseItems.forEach((itm) => {
      this.totalAmt += itm.totalAmount;

    });
  }

  onShowPopOver(event: Event) {
    this.statusPopover.event = event;
    this.statusPopoverOpen = true;
  }

  messageBox(msg: string) {
    this.toastCtrl
      .create({
        color: 'dark',
        duration: 2000,
        position: 'top',
        message: msg,
      })
      .then((res) => {
        res.present();
      });
  }

  ngOnDestroy(): void {
    if (this.dataHaveChanged) {
      this.purchaseService.purchasesHaveChanged.next(true);
    }
  }
}
