import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { PurchaseDto } from 'src/app/classes/purchase-dto.model';
import { PurchaseItem } from 'src/app/classes/purchase-item.model';
import { Purchase } from 'src/app/classes/purchase.model';
import { Vendor } from 'src/app/classes/vendor.model';
import { PurchasesService } from 'src/app/services/purchases.service';
import { VendorSearchComponent } from 'src/app/vendors/vendor-search/vendor-search.component';
import { PurchaseItemDetail } from '../purchased-item/purchase-item.model';
import { PurchaseItemService } from '../purchased-item/purchase-item.service';
import { PurchasedItemComponent } from '../purchased-item/purchased-item.component';

@Component({
  selector: 'app-purchase-detail',
  templateUrl: './purchase-detail.page.html',
  styleUrls: ['./purchase-detail.page.scss'],
})
export class PurchaseDetailPage implements OnInit, OnDestroy {
  purchase = new Purchase();
  vendor = new Vendor();
  purchaseItems: PurchaseItem[] = [];

  isFetching = false;
  modalOpen = false;

  totalAmt = 0;

  constructor(
    private purchaseService: PurchasesService,
    private purchaseItemService: PurchaseItemService,
    private modalCustomerSearch: ModalController,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {}

  onCustomerSearch() {
    if (!this.modalOpen) {
      this.modalOpen = true;
      this.modalCustomerSearch
        .create({ component: VendorSearchComponent })
        .then((modalSearch) => {
          modalSearch.present();
          return modalSearch.onDidDismiss();
        })
        .then((resultData) => {
          if (resultData.role === 'vendor') {
            if (this.purchase.purchaseId) {
              const purchaseDto = new PurchaseDto(
                this.purchase.purchaseId,
                undefined,
                resultData.data
              );
              this.purchaseService
                .putPurchaseSetVendor(purchaseDto)
                .subscribe((res) =>
                  this.messageBox(
                    'You have successfully assigned a new vendor.'
                  )
                );
            }
            this.vendor = resultData.data;
          }
          this.modalOpen = false;
        });
    }
  }

  onAddPurchasedItem() {

    if (!this.modalOpen) {
      this.modalOpen = true;
      this.purchaseItemService.purchaseItemDetail.next(undefined);
      this.modalCustomerSearch
        .create({ component: PurchasedItemComponent })
        .then((modalSearch) => {
          modalSearch.present();
          return modalSearch.onDidDismiss();
        })
        .then((resultData) => {
          if (resultData.role === 'item') {

            const item: PurchaseItemDetail = resultData.data;
            const purchaseItem = new PurchaseItem(
              undefined,
              undefined,
              item.item,
              undefined,
              undefined,
              item.uom,
              item.quantity,
              item.cost
            );

            if (this.purchase.purchaseId) {
              purchaseItem.purchase = this.purchase;
              this.purchaseService
                .putPurchaseItem(purchaseItem)
                .subscribe((res) => {
                  this.purchaseItems = this.purchaseItems.concat(res);
                  this.messageBox('New purchased item has been added.');
                });
            } else {
              this.purchaseItems = this.purchaseItems.concat(purchaseItem);
            }

            this.totalAmt = 0;
            this.purchaseItems.forEach((itm) => {
              this.totalAmt += itm.cost * itm.purchasedQty;
            });
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
    if (this.purchaseItems.length <= 0) {
      this.messageBox('Please provide at least 1 purchased item.');
      return;
    }

    const purchaseDto = new PurchaseDto(
      undefined,
      this.totalAmt,
      this.vendor,
      this.purchaseItems
    );

    this.purchaseService
      .postPurhcase(purchaseDto)
      .subscribe(this.onProcessSavedPurchase());
  }

  onProcessSavedPurchase() {
    return (res: Purchase) => {
      this.purchase.purchaseId = res.purchaseId;
      this.purchase.dateCreated = res.dateCreated;
      this.purchaseItems = res.purchaseItems;
    };
  }

  onUpdatePurchaseItem(pItem?: PurchaseItem) {

    if (!this.modalOpen) {
      this.modalOpen = true;

      const purchaseItemDetail = new PurchaseItemDetail(
        pItem.item,
        pItem.requiredUom,
        pItem.purchasedQty,
        pItem.cost
      );
      this.purchaseItemService.purchaseItemDetail.next(purchaseItemDetail);

      this.modalCustomerSearch
        .create({ component: PurchasedItemComponent })
        .then((modalSearch) => {
          modalSearch.present();
          return modalSearch.onDidDismiss();
        })
        .then((resultData) => {
          if (resultData.role === 'item') {

            const item: PurchaseItemDetail = resultData.data;
            const purchaseItem = new PurchaseItem(
              undefined,
              undefined,
              item.item,
              undefined,
              undefined,
              item.uom,
              item.quantity,
              item.cost
            );

            if (this.purchase.purchaseId) {
              purchaseItem.purchase = this.purchase;
              this.purchaseService
                .putPurchaseItem(purchaseItem)
                .subscribe((res) => {
                  this.purchaseItems = this.purchaseItems.concat(res);
                  this.messageBox('New purchased item has been added.');
                });
            } else {
              this.purchaseItems = this.purchaseItems.concat(purchaseItem);
            }

            this.totalAmt = 0;
            this.purchaseItems.forEach((itm) => {
              this.totalAmt += itm.cost * itm.purchasedQty;
            });
          }
          this.modalOpen = false;
        });
    }
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

  ngOnDestroy(): void {}
}
