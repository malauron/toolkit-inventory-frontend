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
  @ViewChild('statusPopover') statusPopover: IonPopover;
  statusPopoverOpen = false;

  purchase = new Purchase();
  vendor = new Vendor();
  purchaseItems: PurchaseItem[] = [];

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
    // this.statusButton = 'false';
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
        this.purchaseService.getPurchase(purchaseId).subscribe((resData) => {
          this.purchase.purchaseId = resData.purchaseId;
          this.purchase.totalAmt = resData.totalAmt;
          this.purchase.purchaseStatus = resData.purchaseStatus;
          this.purchase.dateCreated = resData.dateCreated;
          this.vendor = resData.vendor;
          this.purchaseItems = resData.purchaseItems;
          this.totalAmt = this.purchase.totalAmt;
          this.isFetching = false;
        });
      } else {
        this.isFetching = false;
      }
    });
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

              this.purchaseService
                .putPurchaseSetVendor(purchaseDto)
                .subscribe((res) => {
                  this.dataHaveChanged = true;
                  this.messageBox(
                    'You have successfully assigned a new vendor.'
                  );
                });
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
      this.modalSearch
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
                  this.dataHaveChanged = true;
                  this.getTotalAmt();
                  this.messageBox('New purchased item has been added.');
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
    if (this.purchaseItems.length <= 0) {
      this.messageBox('Please provide at least 1 purchased item.');
      return;
    }

    const purchaseDto = new PurchaseDto();

    purchaseDto.totalAmt = this.totalAmt;
    purchaseDto.vendor = this.vendor;
    purchaseDto.purchaseItems = this.purchaseItems;

    this.purchaseService
      .postPurhcase(purchaseDto)
      .subscribe(this.onProcessSavedPurchase());
  }

  onProcessSavedPurchase() {
    return (res: Purchase) => {
      this.purchase.purchaseId = res.purchaseId;
      this.purchase.dateCreated = res.dateCreated;
      this.purchaseItems = res.purchaseItems;
      this.dataHaveChanged = true;
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

      this.modalSearch
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
              purchaseItem.purchaseItemId = pItem.purchaseItemId;
              purchaseItem.purchase = this.purchase;
              this.purchaseService
                .putPurchaseItem(purchaseItem)
                .subscribe((res) => {
                  this.dataHaveChanged = true;
                  this.updatePurchaseItemObj(pItem, purchaseItem);
                  this.getTotalAmt();
                  this.messageBox('Purchased item has been updated.');
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
        this.purchaseItems[key].cost = purchaseItem.cost;
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
                this.purchaseService
                  .deletePurchaseItem(pItem)
                  .subscribe((res) => {
                    this.dataHaveChanged = true;
                    this.removeMenuObj(pItem);
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
      this.totalAmt += itm.cost * itm.purchasedQty;
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
