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
import { ItemDto } from 'src/app/classes/item-dto.model';
import { Warehouse } from 'src/app/classes/warehouse.model';
import { ItemsService } from 'src/app/services/items.service';
import { WarehouseSearchComponent } from 'src/app/warehouses/warehouse-search/warehouse-search.component';
import { ButcheryProductionDto } from '../../classes/butchery-production-dto.model';
import { ButcheryProductionItem } from '../../classes/butchery-production-item.model';
import { ButcheryProduction } from '../../classes/butchery-production.model';
import { ProductionDetailsConfig } from '../../config/production-details.config';
import { ButcheryProductionsService } from '../../services/butchery-productions.service';

@Component({
  selector: 'app-production-detail',
  templateUrl: './production-detail.page.html',
  styleUrls: ['./production-detail.page.scss'],
})
export class ProductionDetailPage implements OnInit, OnDestroy {
  @ViewChild('statusPopover') statusPopover: IonPopover;
  @ViewChild('itemSearchBar', { static: true }) itemSearchBar: IonSearchbar;

  statusPopoverOpen = false;

  production: ButcheryProduction;
  warehouse: Warehouse;
  productionItems: ButcheryProductionItem[] = [];
  productionDetailsConfig: ProductionDetailsConfig;

  isUploading = false;
  dataHaveChanged = false;
  isFetching = false;
  modalOpen = false;

  totalAmount = 0;

  constructor(
    private itemsService: ItemsService,
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private productionsService: ButcheryProductionsService,
    private modalSearch: ModalController,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.isFetching = true;

    this.production = new ButcheryProduction();

    this.warehouse = new Warehouse();

    this.productionDetailsConfig = new ProductionDetailsConfig();

    this.route.paramMap.subscribe((paramMap) => {
      if (!paramMap.has('butcheryProductionId')) {
        this.navCtrl.navigateBack('/tabs/productions');
        return;
      }

      if (isNaN(Number(paramMap.get('butcheryProductionId')))) {
        this.navCtrl.navigateBack('/tabs/productions');
        return;
      }

      const butcheryProductionId = Number(paramMap.get('butcheryProductionId'));
      if (butcheryProductionId > 0) {
        this.productionsService.getProduction(butcheryProductionId).subscribe(
          (resData) => {
            if (!resData.butcheryProductionId) {
              this.navCtrl.navigateBack('/tabs/productions');
              return;
            }
            this.production.butcheryProductionId = resData.butcheryProductionId;
            this.production.totalAmount = resData.totalAmount;
            this.production.productionStatus = resData.productionStatus;
            this.productionDetailsConfig.setParams(resData.productionStatus);
            this.production.dateCreated = resData.dateCreated;
            this.warehouse = resData.warehouse;
            this.productionItems = resData.butcheryProductionItems;
            this.totalAmount = this.production.totalAmount;
            this.isFetching = false;
          },
          (err) => {
            this.navCtrl.navigateBack('/tabs/productions');
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
        const partialBarcode = fullBarcode.substring(1, 7);
        console.log(partialBarcode);
        const itemQty = Number(
          fullBarcode.substring(7, 9).concat('.', fullBarcode.substring(9, 12))
        );

        console.log(itemQty);

        this.itemsService.getItemByItemCode(partialBarcode).subscribe((res) => {
          if (res.item) {
            this.addProductionItem(res, fullBarcode, itemQty);
          } else {
            this.messageBox('Item not found!');
          }
        });
      }

      this.itemSearchBar.value = '';
    }
  }

  addProductionItem(itemDto: ItemDto, barcode = '', itemQty = 0) {
    const productionItem = new ButcheryProductionItem();
    const cost = itemDto.item.price;
    const baseQty = 1;

    productionItem.item = itemDto.item;
    productionItem.barcode = barcode;
    productionItem.itemClass = itemDto.item.itemClass;
    productionItem.baseUom = itemDto.item.uom;
    productionItem.baseQty = baseQty;
    productionItem.requiredUom = itemDto.item.uom;
    productionItem.producedQty = itemQty;
    productionItem.productionCost = cost;
    productionItem.totalAmount = baseQty * itemQty * cost;

    if (this.production.butcheryProductionId) {
      productionItem.butcheryProduction = this.production;
      this.productionsService
        .putProductionItem(productionItem)
        .subscribe((res) => {
          this.dataHaveChanged = true;
          this.production.productionStatus = res.productionStatus;
          if (this.production.productionStatus === 'Unposted') {
            this.productionItems = this.productionItems.concat(
              res.butcheryProductionItem
            );
            this.getTotalAmt();
            this.messageBox('New production item has been added.');
          } else {
            this.messageBox(
              'Unable to update the production since its status has been tagged as ' +
                this.production.productionStatus
            );
          }
        });
    } else {
      this.productionItems = this.productionItems.concat(productionItem);
      this.getTotalAmt();
    }
  }

  onUpdateStatus(newStatus: string) {
    if (!this.isUploading) {
      this.isUploading = true;
      const productionDto = new ButcheryProductionDto();

      productionDto.butcheryProductionId = this.production.butcheryProductionId;
      productionDto.productionStatus = newStatus;

      this.productionsService.putProductionSetStatus(productionDto).subscribe(
        (res) => {
          this.dataHaveChanged = true;
          if (res.productionStatus === 'Unposted') {
            this.production.productionStatus = newStatus;
            this.productionDetailsConfig.setParams(newStatus);
            this.messageBox(
              `ButcheryProduction has been ${newStatus.toLowerCase()} successfully.`
            );
          } else {
            this.production.productionStatus = res.productionStatus;
            this.productionDetailsConfig.setParams(res.productionStatus);
            this.messageBox(
              'Unable to update the production since its status has been tagged as ' +
                this.production.productionStatus
            );
          }
          this.isUploading = false;
        },
        (err) => {
          this.dataHaveChanged = true;
          this.messageBox(
            'An error occured while trying to update the production detail.'
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
  //           if (this.production.butcheryProductionId) {
  //             const productionDto = new ButcheryProductionDto();
  //             productionDto.butcheryProductionId = this.production.butcheryProductionId;
  //             this.dataHaveChanged = true;

  //             this.productionsService.putProduction(productionDto).subscribe((res) => {
  //               this.production.productionStatus = res.productionStatus;
  //               if (this.production.productionStatus === 'Unposted') {
  //                 this.messageBox(
  //                   'You have successfully assigned a new vendor.'
  //                 );
  //               } else {
  //                 this.messageBox(
  //                   'Unable to update the production since its status has been tagged as ' +
  //                     this.production.productionStatus
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
            if (this.production.butcheryProductionId) {
              const productionDto = new ButcheryProductionDto();
              productionDto.butcheryProductionId =
                this.production.butcheryProductionId;
              productionDto.warehouse = resultData.data;
              this.dataHaveChanged = true;

              this.productionsService
                .putProduction(productionDto)
                .subscribe((res) => {
                  this.production.productionStatus = res.productionStatus;
                  if (this.production.productionStatus === 'Unposted') {
                    this.warehouse = resultData.data;
                    this.messageBox(
                      `Produced items will be stored to ${this.warehouse.warehouseName}.`
                    );
                  } else {
                    this.messageBox(
                      'Unable to update the production since its status has been tagged as ' +
                        this.production.productionStatus
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

  onAddProductionItem() {
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
    //         const productionItem = new ButcheryProductionItem();
    //         productionItem.item = item.item;
    //         productionItem.requiredUom = item.uom;
    //         productionItem.producedQty = item.quantity;
    //         productionItem.productionCost = item.price;
    //         productionItem.totalAmount = item.quantity * item.price;
    //         if (this.production.butcheryProductionId) {
    //           productionItem.butcheryProduction = this.production;
    //           this.productionsService
    //             .putProductionItem(productionItem)
    //             .subscribe((res) => {
    //               this.dataHaveChanged = true;
    //               this.production.productionStatus = res.productionStatus;
    //               if (this.production.productionStatus === 'Unposted') {
    //                 this.productionItems = this.productionItems.concat(
    //                   res.productionItem
    //                 );
    //                 this.getTotalAmt();
    //                 this.messageBox('New purchased item has been added.');
    //               } else {
    //                 this.messageBox(
    //                   'Unable to update the production since its status has been tagged as ' +
    //                     this.production.productionStatus
    //                 );
    //               }
    //             });
    //         } else {
    //           this.productionItems = this.productionItems.concat(productionItem);
    //           this.getTotalAmt();
    //         }
    //       }
    //       this.modalOpen = false;
    //     });
    // }
  }

  onSaveProduction() {
    if (!this.warehouse.warehouseId) {
      this.messageBox('Please choose a warehouse.');
      return;
    }

    if (this.productionItems.length <= 0) {
      this.messageBox('Please add at least 1 production item.');
      return;
    }

    const productionDto = new ButcheryProductionDto();

    productionDto.totalAmount = this.totalAmount;
    productionDto.warehouse = this.warehouse;
    productionDto.butcheryProductionItems = this.productionItems;

    this.productionsService
      .postProduction(productionDto)
      .subscribe(this.onProcessSavedProduction());
  }

  onProcessSavedProduction() {
    return (res: ButcheryProduction) => {
      this.production.butcheryProductionId = res.butcheryProductionId;
      this.production.productionStatus = res.productionStatus;
      this.production.totalAmount = res.totalAmount;
      this.productionDetailsConfig.setParams(res.productionStatus);
      this.production.dateCreated = res.dateCreated;
      this.productionItems = res.butcheryProductionItems;
      this.dataHaveChanged = true;
    };
  }

  onUpdateProductionItem(pItem?: ButcheryProductionItem) {
    // if (!this.modalOpen) {
    //   this.modalOpen = true;
    //   const purchaseItemDetail = new PurchaseItemDetail();
    //   purchaseItemDetail.item = pItem.item;
    //   purchaseItemDetail.uom = pItem.requiredUom;
    //   purchaseItemDetail.quantity = pItem.producedQty;
    //   purchaseItemDetail.price = pItem.productionCost;
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
    //         const productionItem = new ButcheryProductionItem();
    //         productionItem.item = item.item;
    //         productionItem.requiredUom = item.uom;
    //         productionItem.producedQty = item.quantity;
    //         productionItem.productionCost = item.price;
    //         productionItem.totalAmount = item.quantity * item.price;
    //         if (this.production.butcheryProductionId) {
    //           productionItem.butcheryProductionItemId = pItem.butcheryProductionItemId;
    //           productionItem.butcheryProduction = this.production;
    //           this.productionsService
    //             .putProductionItem(productionItem)
    //             .subscribe((res) => {
    //               this.dataHaveChanged = true;
    //               this.production.productionStatus = res.productionStatus;
    //               if (this.production.productionStatus === 'Unposted') {
    //                 this.updatePurchaseItemObj(pItem, productionItem);
    //                 this.getTotalAmt();
    //                 this.messageBox('Purchased item has been updated.');
    //               } else {
    //                 this.messageBox(
    //                   'Unable to update the production since its status has been tagged as ' +
    //                     this.production.productionStatus
    //                 );
    //               }
    //             });
    //         } else {
    //           this.updatePurchaseItemObj(pItem, productionItem);
    //           this.getTotalAmt();
    //         }
    //       }
    //       this.modalOpen = false;
    //     });
    // }
  }

  updateProductionItemObj(
    pItem: ButcheryProductionItem,
    productionItem: ButcheryProductionItem
  ) {
    for (const key in this.productionItems) {
      if (pItem === this.productionItems[key]) {
        this.productionItems[key].item = productionItem.item;
        this.productionItems[key].requiredUom = productionItem.requiredUom;
        this.productionItems[key].producedQty = productionItem.producedQty;
        this.productionItems[key].productionCost =
          productionItem.productionCost;
        this.productionItems[key].totalAmount = productionItem.totalAmount;
      }
    }
  }

  onDeleteProductionItem(pItem: ButcheryProductionItem) {
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
              if (pItem.butcheryProductionItemId !== undefined) {
                pItem.butcheryProduction = this.production;
                this.productionsService
                  .deleteProductionItem(pItem)
                  .subscribe((res) => {
                    this.dataHaveChanged = true;
                    this.production.productionStatus = res.productionStatus;
                    if (this.production.productionStatus === 'Unposted') {
                      this.removeMenuObj(pItem);
                      this.messageBox(
                        'ButcheryProduction item has been deleted successfully.'
                      );
                    } else {
                      this.messageBox(
                        'Unable to delete the production item since production has been tagged as ' +
                          this.production.productionStatus
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

  removeMenuObj(pItem: ButcheryProductionItem) {
    for (const key in this.productionItems) {
      if (pItem === this.productionItems[key]) {
        this.productionItems.splice(Number(key), 1);
      }
    }
    this.getTotalAmt();
  }

  getTotalAmt() {
    this.totalAmount = 0;
    this.productionItems.forEach((itm) => {
      this.totalAmount += itm.totalAmount;
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
      this.productionsService.productionsHaveChanged.next(true);
    }
  }
}
