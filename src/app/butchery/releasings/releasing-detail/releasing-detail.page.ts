import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  AlertController,
  IonPopover,
  IonSearchbar,
  ModalController,
  NavController,
  ToastController,
} from '@ionic/angular';
import { Customer } from 'src/app/classes/customer.model';
import { ItemDto } from 'src/app/classes/item-dto.model';
import { Warehouse } from 'src/app/classes/warehouse.model';
import { CustomerSearchComponent } from 'src/app/customers/customer-search/customer-search.component';
import { ItemsService } from 'src/app/services/items.service';
import { WarehouseSearchComponent } from 'src/app/warehouses/warehouse-search/warehouse-search.component';
import { ButcheryReleasingDto } from '../../classes/butchery-releasing-dto.model';
import { ButcheryReleasingItem } from '../../classes/butchery-releasing-item.model';
import { ButcheryReleasing } from '../../classes/butchery-releasing.model';
import { ReleasingDetailsConfig } from '../../config/releasing-details.config';
import { ButcheryReleasingsService } from '../../services/butchery-releasings.service';

@Component({
  selector: 'app-releasing-detail',
  templateUrl: './releasing-detail.page.html',
  styleUrls: ['./releasing-detail.page.scss'],
})
export class ReleasingDetailPage implements OnInit, OnDestroy {
  @ViewChild('statusPopover') statusPopover: IonPopover;
  @ViewChild('itemSearchBar', { static: true }) itemSearchBar: IonSearchbar;

  statusPopoverOpen = false;

  releasing: ButcheryReleasing;
  warehouse: Warehouse;
  customer: Customer;
  releasingItems: ButcheryReleasingItem[] = [];
  releasingDetailsConfig: ReleasingDetailsConfig;

  isUploading = false;
  dataHaveChanged = false;
  isFetching = false;
  modalOpen = false;

  totalAmount = 0;

  constructor(
    private itemsService: ItemsService,
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private releasingsService: ButcheryReleasingsService,
    private modalSearch: ModalController,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.isFetching = true;

    this.releasing = new ButcheryReleasing();

    this.warehouse = new Warehouse();

    this.customer = new Customer();

    this.releasingDetailsConfig = new ReleasingDetailsConfig();

    this.route.paramMap.subscribe((paramMap) => {
      if (!paramMap.has('butcheryReleasingId')) {
        this.navCtrl.navigateBack('/tabs/releasings');
        return;
      }

      if (isNaN(Number(paramMap.get('butcheryReleasingId')))) {
        this.navCtrl.navigateBack('/tabs/releasings');
        return;
      }

      const butcheryReleasingId = Number(paramMap.get('butcheryReleasingId'));
      if (butcheryReleasingId > 0) {
        this.releasingsService.getReleasing(butcheryReleasingId).subscribe(
          (resData) => {
            if (!resData.butcheryReleasingId) {
              this.navCtrl.navigateBack('/tabs/releasings');
              return;
            }
            this.releasing.butcheryReleasingId = resData.butcheryReleasingId;
            this.releasing.totalAmount = resData.totalAmount;
            this.releasing.releasingStatus = resData.releasingStatus;
            this.releasingDetailsConfig.setParams(resData.releasingStatus);
            this.releasing.dateCreated = resData.dateCreated;
            this.warehouse = resData.warehouse;
            this.customer = resData.customer;
            this.releasingItems = resData.butcheryReleasingItems;
            this.totalAmount = this.releasing.totalAmount;
            this.isFetching = false;
          },
          (err) => {
            this.navCtrl.navigateBack('/tabs/releasings');
            return;
          }
        );
      } else {
        this.isFetching = false;
      }
    });
  }

  onGetItemByItemCode(event) {
    if (event && event.key === 'Enter') {
      const fullBarcode = this.itemSearchBar.value;

      if (fullBarcode.length >= 12 && !isNaN(Number(fullBarcode))) {
        const partialBarcode = fullBarcode.substring(1, 6);
        const itemQty = Number(
          fullBarcode.substring(6, 8).concat('.', fullBarcode.substring(8, 11))
        );

        this.itemsService.getItemByItemCode(partialBarcode).subscribe((res) => {
          if (res.item) {
            this.addReleasingItem(res, fullBarcode, itemQty);
          } else {
            this.messageBox('Item not found!');
          }
        });
      }

      this.itemSearchBar.value = '';
    }
  }

  addReleasingItem(itemDto: ItemDto, barcode = '', itemQty = 0) {
    const releasingItem = new ButcheryReleasingItem();
    const cost = itemDto.item.price;
    const baseQty = 1;

    releasingItem.item = itemDto.item;
    releasingItem.barcode = barcode;
    releasingItem.itemClass = itemDto.item.itemClass;
    releasingItem.baseUom = itemDto.item.uom;
    releasingItem.baseQty = baseQty;
    releasingItem.cost = 0;
    releasingItem.requiredUom = itemDto.item.uom;
    releasingItem.releasedQty = itemQty;
    releasingItem.itemPrice = cost;
    releasingItem.totalAmount = baseQty * itemQty * cost;

    if (this.releasing.butcheryReleasingId) {
      releasingItem.butcheryReleasing = this.releasing;
      this.releasingsService
        .putReleasingItem(releasingItem)
        .subscribe((res) => {
          this.dataHaveChanged = true;
          this.releasing.releasingStatus = res.releasingStatus;
          if (this.releasing.releasingStatus === 'Unposted') {
            this.releasingItems = this.releasingItems.concat(
              res.butcheryReleasingItem
            );
            this.getTotalAmt();
            this.messageBox('New releasing item has been added.');
          } else {
            this.messageBox(
              'Unable to update the releasing since its status has been tagged as ' +
                this.releasing.releasingStatus
            );
          }
        });
    } else {
      this.releasingItems = this.releasingItems.concat(releasingItem);
      this.getTotalAmt();
    }
  }

  onUpdateStatus(newStatus: string) {
    if (!this.isUploading) {
      this.isUploading = true;
      const releasingDto = new ButcheryReleasingDto();

      releasingDto.butcheryReleasingId = this.releasing.butcheryReleasingId;
      releasingDto.releasingStatus = newStatus;

      this.releasingsService.putReleasingSetStatus(releasingDto).subscribe(
        (res) => {
          if (res.errorDescription) {
            this.messageBox(res.errorDescription);
            this.isUploading = false;
            return;
          }
          this.dataHaveChanged = true;
          if (res.releasingStatus === 'Unposted') {
            this.releasing.releasingStatus = newStatus;
            this.releasingDetailsConfig.setParams(newStatus);
            this.messageBox(
              `ButcheryReleasing has been ${newStatus.toLowerCase()} successfully.`
            );
          } else {
            this.releasing.releasingStatus = res.releasingStatus;
            this.releasingDetailsConfig.setParams(res.releasingStatus);
            this.messageBox(
              'Unable to update the releasing since its status has been tagged as ' +
                this.releasing.releasingStatus
            );
          }
          this.isUploading = false;
        },
        (err) => {
          this.dataHaveChanged = true;
          this.messageBox(
            'An error occured while trying to update the releasing detail.'
          );
          this.isUploading = false;
        }
      );
    }
  }

  // onCustomerSearch() {
  //   if (!this.modalOpen) {
  //     this.modalOpen = true;
  //     this.modalSearch
  //       .create({ component: VendorSearchComponent })
  //       .then((modalSearch) => {
  //         modalSearch.present();
  //         return modalSearch.onDidDismiss();
  //       })
  //       .then((resultData) => {
  //         if (resultData.role === 'vendor') {
  //           if (this.releasing.butcheryReleasingId) {
  //             const releasingDto = new ButcheryReleasingDto();
  //             releasingDto.butcheryReleasingId = this.releasing.butcheryReleasingId;
  //             this.dataHaveChanged = true;

  //             this.releasingsService.putReleasing(releasingDto).subscribe((res) => {
  //               this.releasing.releasingStatus = res.releasingStatus;
  //               if (this.releasing.releasingStatus === 'Unposted') {
  //                 this.messageBox(
  //                   'You have successfully assigned a new vendor.'
  //                 );
  //               } else {
  //                 this.messageBox(
  //                   'Unable to update the releasing since its status has been tagged as ' +
  //                     this.releasing.releasingStatus
  //                 );
  //               }
  //             });
  //           } else {
  //           }
  //         }
  //         this.modalOpen = false;
  //       });
  //   }
  // }

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
            if (this.releasing.butcheryReleasingId) {
              const releasingDto = new ButcheryReleasingDto();
              releasingDto.butcheryReleasingId =
                this.releasing.butcheryReleasingId;
              releasingDto.warehouse = resultData.data;
              this.dataHaveChanged = true;

              this.releasingsService
                .putReleasing(releasingDto)
                .subscribe((res) => {
                  this.releasing.releasingStatus = res.releasingStatus;
                  if (this.releasing.releasingStatus === 'Unposted') {
                    this.warehouse = resultData.data;
                    this.messageBox(
                      `Produced items will be stored to ${this.warehouse.warehouseName}.`
                    );
                  } else {
                    this.messageBox(
                      'Unable to update the releasing since its status has been tagged as ' +
                        this.releasing.releasingStatus
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

  onCustomerSearch() {
    if (!this.modalOpen) {
      this.modalOpen = true;
      this.modalSearch
        .create({ component: CustomerSearchComponent })
        .then((modalSearch) => {
          modalSearch.present();
          return modalSearch.onDidDismiss();
        })
        .then((resultData) => {
          if (resultData.role === 'customer') {
            if (this.releasing.butcheryReleasingId) {
              const releasingDto = new ButcheryReleasingDto();
              releasingDto.butcheryReleasingId =
                this.releasing.butcheryReleasingId;
              releasingDto.customer = resultData.data;
              this.dataHaveChanged = true;

              this.releasingsService
                .putReleasing(releasingDto)
                .subscribe((res) => {
                  this.releasing.releasingStatus = res.releasingStatus;
                  if (this.releasing.releasingStatus === 'Unposted') {
                    this.customer = resultData.data;
                    this.messageBox(
                      `Produced items will be delivered to ${this.customer.customerName}.`
                    );
                  } else {
                    this.messageBox(
                      'Unable to update the releasing since its status has been tagged as ' +
                        this.releasing.releasingStatus
                    );
                  }
                });
            } else {
              this.customer = resultData.data;
            }
          }
          this.modalOpen = false;
        });
    }
  }

  onAddReleasingItem() {
    // if (!this.modalOpen) {
    //   this.modalOpen = true;
    //   this.purchaseItemService.purchaseItemDetail.next(undefined);
    //   this.modalSearch
    //     .create({ component: PurchasedItemComponent })
    //     .then((modalSearch) => {
    //       modalSearch.present();
    //       return modalSearch.onDidDismiss();
    //     })
    //     .then((resultData) => {
    //       if (resultData.role === 'item') {
    //         const item: PurchaseItemDetail = resultData.data;
    //         const releasingItem = new ButcheryReleasingItem();
    //         releasingItem.item = item.item;
    //         releasingItem.requiredUom = item.uom;
    //         releasingItem.releasedQty = item.quantity;
    //         releasingItem.itemPrice = item.price;
    //         releasingItem.totalAmount = item.quantity * item.price;
    //         if (this.releasing.butcheryReleasingId) {
    //           releasingItem.butcheryReleasing = this.releasing;
    //           this.releasingsService
    //             .putReleasingItem(releasingItem)
    //             .subscribe((res) => {
    //               this.dataHaveChanged = true;
    //               this.releasing.releasingStatus = res.releasingStatus;
    //               if (this.releasing.releasingStatus === 'Unposted') {
    //                 this.releasingItems = this.releasingItems.concat(
    //                   res.releasingItem
    //                 );
    //                 this.getTotalAmt();
    //                 this.messageBox('New purchased item has been added.');
    //               } else {
    //                 this.messageBox(
    //                   'Unable to update the releasing since its status has been tagged as ' +
    //                     this.releasing.releasingStatus
    //                 );
    //               }
    //             });
    //         } else {
    //           this.releasingItems = this.releasingItems.concat(releasingItem);
    //           this.getTotalAmt();
    //         }
    //       }
    //       this.modalOpen = false;
    //     });
    // }
  }

  onSaveReleasing() {
    if (this.isUploading) {
      return;
    }

    if (!this.warehouse.warehouseId) {
      this.messageBox('Please choose a warehouse.');
      return;
    }

    if (!this.customer.customerId) {
      this.messageBox('Please choose a customer.');
      return;
    }

    if (this.releasingItems.length <= 0) {
      this.messageBox('Please add at least 1 releasing item.');
      return;
    }

    this.isUploading = true;

    const releasingDto = new ButcheryReleasingDto();

    releasingDto.totalAmount = this.totalAmount;
    releasingDto.warehouse = this.warehouse;
    releasingDto.customer = this.customer;
    releasingDto.butcheryReleasingItems = this.releasingItems;

    this.releasingsService
      .postReleasing(releasingDto)
      .subscribe(this.onProcessSavedReleasing());
  }

  onProcessSavedReleasing() {
    return (res: ButcheryReleasing) => {
      this.releasing.butcheryReleasingId = res.butcheryReleasingId;
      this.releasing.releasingStatus = res.releasingStatus;
      this.releasing.totalAmount = res.totalAmount;
      this.releasingDetailsConfig.setParams(res.releasingStatus);
      this.releasing.dateCreated = res.dateCreated;
      this.releasingItems = res.butcheryReleasingItems;
      this.dataHaveChanged = true;
      this.isUploading = false;
    };
  }

  onUpdateReleasingItem(pItem?: ButcheryReleasingItem) {
    // if (!this.modalOpen) {
    //   this.modalOpen = true;
    //   const purchaseItemDetail = new PurchaseItemDetail();
    //   purchaseItemDetail.item = pItem.item;
    //   purchaseItemDetail.uom = pItem.requiredUom;
    //   purchaseItemDetail.quantity = pItem.releasedQty;
    //   purchaseItemDetail.price = pItem.itemPrice;
    //   this.purchaseItemService.purchaseItemDetail.next(purchaseItemDetail);
    //   this.modalSearch
    //     .create({ component: PurchasedItemComponent })
    //     .then((modalSearch) => {
    //       modalSearch.present();
    //       return modalSearch.onDidDismiss();
    //     })
    //     .then((resultData) => {
    //       if (resultData.role === 'item') {
    //         const item: PurchaseItemDetail = resultData.data;
    //         const releasingItem = new ButcheryReleasingItem();
    //         releasingItem.item = item.item;
    //         releasingItem.requiredUom = item.uom;
    //         releasingItem.releasedQty = item.quantity;
    //         releasingItem.itemPrice = item.price;
    //         releasingItem.totalAmount = item.quantity * item.price;
    //         if (this.releasing.butcheryReleasingId) {
    //           releasingItem.butcheryReleasingItemId = pItem.butcheryReleasingItemId;
    //           releasingItem.butcheryReleasing = this.releasing;
    //           this.releasingsService
    //             .putReleasingItem(releasingItem)
    //             .subscribe((res) => {
    //               this.dataHaveChanged = true;
    //               this.releasing.releasingStatus = res.releasingStatus;
    //               if (this.releasing.releasingStatus === 'Unposted') {
    //                 this.updatePurchaseItemObj(pItem, releasingItem);
    //                 this.getTotalAmt();
    //                 this.messageBox('Purchased item has been updated.');
    //               } else {
    //                 this.messageBox(
    //                   'Unable to update the releasing since its status has been tagged as ' +
    //                     this.releasing.releasingStatus
    //                 );
    //               }
    //             });
    //         } else {
    //           this.updatePurchaseItemObj(pItem, releasingItem);
    //           this.getTotalAmt();
    //         }
    //       }
    //       this.modalOpen = false;
    //     });
    // }
  }

  updateReleasingItemObj(
    pItem: ButcheryReleasingItem,
    releasingItem: ButcheryReleasingItem
  ) {
    for (const key in this.releasingItems) {
      if (pItem === this.releasingItems[key]) {
        this.releasingItems[key].item = releasingItem.item;
        this.releasingItems[key].requiredUom = releasingItem.requiredUom;
        this.releasingItems[key].releasedQty = releasingItem.releasedQty;
        this.releasingItems[key].itemPrice = releasingItem.itemPrice;
        this.releasingItems[key].totalAmount = releasingItem.totalAmount;
      }
    }
  }

  onDeleteReleasingItem(pItem: ButcheryReleasingItem) {
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
              if (pItem.butcheryReleasingItemId !== undefined) {
                pItem.butcheryReleasing = this.releasing;
                this.releasingsService
                  .deleteReleasingItem(pItem)
                  .subscribe((res) => {
                    this.dataHaveChanged = true;
                    this.releasing.releasingStatus = res.releasingStatus;
                    if (this.releasing.releasingStatus === 'Unposted') {
                      this.removeMenuObj(pItem);
                      this.messageBox(
                        'ButcheryReleasing item has been deleted successfully.'
                      );
                    } else {
                      this.messageBox(
                        'Unable to delete the releasing item since releasing has been tagged as ' +
                          this.releasing.releasingStatus
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

  removeMenuObj(pItem: ButcheryReleasingItem) {
    for (const key in this.releasingItems) {
      if (pItem === this.releasingItems[key]) {
        this.releasingItems.splice(Number(key), 1);
      }
    }
    this.getTotalAmt();
  }

  getTotalAmt() {
    this.totalAmount = 0;
    this.releasingItems.forEach((itm) => {
      this.totalAmount += itm.totalAmount;
    });
  }

  onShowPopOver(event: Event) {
    this.statusPopover.event = event;
    this.statusPopoverOpen = true;
  }

  printPage() {
    window.print();
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
      this.releasingsService.releasingsHaveChanged.next(true);
    }
  }
}
