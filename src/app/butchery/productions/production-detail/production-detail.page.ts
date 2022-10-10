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
import { Warehouse } from 'src/app/classes/warehouse.model';
import { WarehouseSearchComponent } from 'src/app/warehouses/warehouse-search/warehouse-search.component';
import { ButcheryProductionDto } from '../../classes/butchery-production-dto.model';
import { ButcheryProductionItem } from '../../classes/butchery-production-item.model';
import { ButcheryProduction } from '../../classes/butchery-production.model';
import { ProductionDetailsConfig } from '../../config/production-details.config';
import { ProductionsService } from '../../services/productions.service';

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

  totalWeight = 0;

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private productionsService: ProductionsService,
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
            this.production.totalWeight = resData.totalWeight;
            this.production.productionStatus = resData.productionStatus;
            this.productionDetailsConfig.setParams(resData.productionStatus);
            this.production.dateCreated = resData.dateCreated;
            this.warehouse = resData.warehouse;
            this.productionItems = resData.butcheryProductionItems;
            this.totalWeight = this.production.totalWeight;
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
      const searchDesc = this.itemSearchBar.value;

      console.log(Number(searchDesc));

      if (searchDesc.length >= 12 && !isNaN(Number(searchDesc))) {
        const barCode = searchDesc.substring(1,6);
        const itemPrice = searchDesc.substring(6,8).concat('.',searchDesc.substring(8,11));
      console.log(barCode);
      console.log(itemPrice);
      }

      this.itemSearchBar.value = '';
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
      this.messageBox('Please provide at least 1 produced item.');
      return;
    }

    const productionDto = new ButcheryProductionDto();

    productionDto.totalWeight = this.totalWeight;
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
    // this.alertCtrl
    //   .create({
    //     header: 'Confirm',
    //     message: 'This will be deleted permanently .',
    //     buttons: [
    //       {
    //         text: 'Cancel',
    //       },
    //       {
    //         text: 'Delete',
    //         handler: () => {
    //           if (pItem.butcheryProductionItemId !== undefined) {
    //             pItem.butcheryProduction = this.production;
    //             this.productionsService
    //               .deleteProductionItem(pItem)
    //               .subscribe((res) => {
    //                 this.dataHaveChanged = true;
    //                 this.production.productionStatus = res.productionStatus;
    //                 if (this.production.productionStatus === 'Unposted') {
    //                   this.removeMenuObj(pItem);
    //                   this.messageBox(
    //                     'ButcheryProduction item has been deleted successfully.'
    //                   );
    //                 } else {
    //                   this.messageBox(
    //                     'Unable to delete the production item since production has been tagged as ' +
    //                       this.production.productionStatus
    //                   );
    //                 }
    //               });
    //           } else {
    //             this.removeMenuObj(pItem);
    //           }
    //         },
    //       },
    //     ],
    //   })
    //   .then((res) => {
    //     res.present();
    //   });
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
    this.totalWeight = 0;
    this.productionItems.forEach((itm) => {
      this.totalWeight += itm.totalAmount;
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
    console.log('exiting...');
    if (this.dataHaveChanged) {
      this.productionsService.productionsHaveChanged.next(true);
    }
  }
}
