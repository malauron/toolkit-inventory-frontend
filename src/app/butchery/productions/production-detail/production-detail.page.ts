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
import { User } from 'src/app/Security/classes/user.model';
import { AuthenticationService } from 'src/app/Security/services/authentication.service';
import { ItemsService } from 'src/app/services/items.service';
import { WarehousesService } from 'src/app/services/warehouses.service';
import { WarehouseSearchComponent } from 'src/app/warehouses/warehouse-search/warehouse-search.component';
import { ButcheryProductionDto } from '../../classes/butchery-production-dto.model';
import { ButcheryProductionItem } from '../../classes/butchery-production-item.model';
import { ButcheryProductionSource } from '../../classes/butchery-production-source.model';
import { ButcheryProduction } from '../../classes/butchery-production.model';
import { ProductionDetailsConfig } from '../../config/production-details.config';
import { ButcheryProductionsService } from '../../services/butchery-productions.service';
import { ButcheryReceivingsService } from '../../services/butchery-receivings.service';
import { ProductionItemComponent } from '../production-item/production-item.component';
import { ProductionSourceComponent } from '../production-source/production-source.component';
import { ProductionSourceService } from '../production-source/production-source.service';

@Component({
  selector: 'app-production-detail',
  templateUrl: './production-detail.page.html',
  styleUrls: ['./production-detail.page.scss'],
})
export class ProductionDetailPage implements OnInit, OnDestroy {
  @ViewChild('statusPopover') statusPopover: IonPopover;
  @ViewChild('itemSearchBar') itemSearchBar: IonSearchbar;
  @ViewChild('sourceSearchBar') sourceSearchBar: IonSearchbar;

  statusPopoverOpen = false;

  production: ButcheryProduction;
  warehouse: Warehouse;
  user: User;
  productionItems: ButcheryProductionItem[] = [];
  productionSources: ButcheryProductionSource[] = [];
  productionDetailsConfig: ProductionDetailsConfig;

  isUploading = false;
  dataHaveChanged = false;
  isFetching = false;
  modalOpen = false;

  totalProducedWeightKg = 0;

  constructor(
    private itemsService: ItemsService,
    private butcheryReceivingsService: ButcheryReceivingsService,
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private productionsService: ButcheryProductionsService,
    private productionSourceService: ProductionSourceService,
    private warehousesService: WarehousesService,
    private authenticationService: AuthenticationService,
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
        this.productionsService.getProduction(butcheryProductionId).subscribe({
          next: (resData) => {
            if (!resData.butcheryProductionId) {
              this.navCtrl.navigateBack('/tabs/productions');
              return;
            }
            this.production.butcheryProductionId = resData.butcheryProductionId;
            this.production.totalProducedWeightKg = resData.totalProducedWeightKg;
            this.production.productionStatus = resData.productionStatus;
            this.productionDetailsConfig.setParams(resData.productionStatus);
            this.production.dateCreated = resData.dateCreated;
            this.warehouse = resData.warehouse;
            this.productionItems = resData.butcheryProductionItems;
            this.productionSources = resData.butcheryProductionSourceViews;
            this.totalProducedWeightKg = this.production.totalProducedWeightKg;

            this.productionSourceService.warehouse.next(this.warehouse);

            this.isFetching = false;
          },
          error: (err) => {
            this.navCtrl.navigateBack('/tabs/productions');
            return;
          }
        });
      } else {
        this.user = this.authenticationService.getUserFromLocalCache();
        this.warehousesService
          .getWarehouseByUserId(this.user.userId)
          .subscribe({
            next: (res) => {
              this.warehouse.warehouseId = res.warehouseId;
              this.warehouse.warehouseName = res.warehouseName;
              this.productionSourceService.warehouse.next(this.warehouse);
            },
            error: (err) => {
              this.isFetching = false;
            },
            complete: () => {
              this.isFetching = false;
            },
          });
      }
    });
  }

  onGetItemByItemCode(event) {
    if (event && event.key === 'Enter') {
      const fullBarcode = this.itemSearchBar.value;

      if (fullBarcode.length >= 12 && !isNaN(Number(fullBarcode))) {
        const partialBarcode = fullBarcode.substring(2, 7);
        const itemQty = Number(
          fullBarcode.substring(7, 9).concat('.', fullBarcode.substring(9, 12))
        );

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
    productionItem.producedQty = 1;
    productionItem.producedWeightKg = itemQty;
    if (this.production.butcheryProductionId) {
      productionItem.butcheryProduction = this.production;
      this.productionsService
        .putProductionItem(productionItem)
        .subscribe((res) => {
          this.dataHaveChanged = true;
          this.production.productionStatus = res.productionStatus;
          if (this.production.productionStatus === 'Unposted') {
            this.productionItems.unshift(res.butcheryProductionItem);
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
      this.productionItems.unshift(productionItem);
      this.getTotalAmt();
    }
  }

  onManuallyAddProductionItem() {
    if (!this.modalOpen) {
      this.modalOpen = true;

      this.modalSearch
        .create({
          component: ProductionItemComponent,
          cssClass: 'custom-modal-styles',
          // componentProps: { batch: this.butcheryBatch },
        })
        .then((modalSearch) => {
          modalSearch.present();
          return modalSearch.onDidDismiss();
        })
        .then((resultData) => {
          if (resultData.role === 'item') {
            // this.addProductionSource(resultData.data);
            const producedItem = new ButcheryProductionItem();
            producedItem.item = resultData.data.item;
            producedItem.barcode = resultData.data.item.itemCode;
            producedItem.itemClass = resultData.data.item.itemClass;
            producedItem.requiredUom = resultData.data.requiredUom;
            producedItem.producedQty = resultData.data.producedQty;
            producedItem.producedWeightKg = resultData.data.producedWeightKg;
            if (this.production.butcheryProductionId) {
              producedItem.butcheryProduction = this.production;
              this.productionsService
                .putProductionItem(producedItem)
                .subscribe((res) => {
                  this.dataHaveChanged = true;
                  this.production.productionStatus = res.productionStatus;
                  if (this.production.productionStatus === 'Unposted') {
                    this.productionItems.unshift(res.butcheryProductionItem);
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
              this.productionItems.unshift(producedItem);
              this.getTotalAmt();
            }
          }
          this.modalOpen = false;
        });
    }
  }

  onGetSourceBySourceId(event) {
    if (event && event.key === 'Enter') {
      const fullBarcode = this.sourceSearchBar.value;

      const numSep = fullBarcode.indexOf('-');

      if (numSep > 0) {
        if (
          !isNaN(Number(fullBarcode.substring(0, numSep))) &&
          !isNaN(Number(fullBarcode.substring(numSep + 1, fullBarcode.length)))
        ) {
          const sourceId = Number(fullBarcode.substring(0, numSep));
          const requiredQty = Number(
            fullBarcode.substring(numSep + 1, fullBarcode.length)
          );

          // this.butcheryReceivingsService
          //   .getReceivingItem(sourceId)
          //   .subscribe((res) => {
          //     if (res !== null) {
          //       const pSource = new ButcheryProductionSource();
          //       pSource.butcheryReceivingItem = res;
          //       pSource.requiredQty = requiredQty;
          //       this.addProductionSource(pSource);
          //     } else {
          //       this.messageBox('Production source not found.');
          //     }
          //   });
        }
      }

      this.sourceSearchBar.value = '';
    }
  }

  addProductionSource(productionSource: ButcheryProductionSource) {
    if (this.production.butcheryProductionId) {
      productionSource.butcheryProduction = this.production;
      this.productionsService
        .putProductionSource(productionSource)
        .subscribe((res) => {
          this.dataHaveChanged = true;
          this.production.productionStatus = res.productionStatus;
          if (this.production.productionStatus === 'Unposted') {
            this.productionSources.unshift(res.butcheryProductionSourceView);
            this.messageBox('New production source has been added.');
          } else {
            this.messageBox(
              'Unable to update the production since its status has been tagged as ' +
                this.production.productionStatus
            );
          }
        });
    } else {
      this.productionSources.unshift(productionSource);
    }
  }

  onManuallyAddProductionSource() {
    if (!this.modalOpen) {
      this.modalOpen = true;

      if (!this.warehouse.warehouseId) {
        this.messageBox('Please choose a warehouse.');
        this.modalOpen = false;
        return;
      }

      this.modalSearch
        .create({
          component: ProductionSourceComponent,
          cssClass: 'custom-modal-styles',
        })
        .then((modalSearch) => {
          modalSearch.present();
          return modalSearch.onDidDismiss();
        })
        .then((resultData) => {
          if (resultData.role === 'item') {
            this.addProductionSource(resultData.data);
          }
          this.modalOpen = false;
        });
    }
  }

  onUpdateStatus(newStatus: string) {
    if (!this.isUploading) {
      this.isUploading = true;
      const productionDto = new ButcheryProductionDto();

      productionDto.butcheryProductionId = this.production.butcheryProductionId;
      productionDto.productionStatus = newStatus;

      this.productionsService.putProductionSetStatus(productionDto).subscribe({
        next: (res) => {
          this.dataHaveChanged = true;
          if (res.productionStatus === 'Unposted') {
            this.production.productionStatus = newStatus;
            this.productionDetailsConfig.setParams(newStatus);
            this.messageBox(
              `Butchery Production has been ${newStatus.toLowerCase()} successfully.`
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
        error: (err) => {
          this.dataHaveChanged = true;
          this.messageBox(
            'An error occured while trying to update the production detail.'
          );
          this.isUploading = false;
        }
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
                    this.productionSourceService.warehouse.next(this.warehouse);
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
              this.productionSourceService.warehouse.next(this.warehouse);
            }
          }
          this.modalOpen = false;
        });
    }
  }

  onSaveProduction() {
    if (!this.warehouse.warehouseId) {
      this.messageBox('Please choose a warehouse.');
      return;
    }

    // if (!this.butcheryBatch.butcheryBatchId) {
    //   this.messageBox('Please specify batch.');
    //   return;
    // }

    if (this.productionItems.length <= 0) {
      this.messageBox('Please add at least 1 production item.');
      return;
    }

    if (this.productionSources.length <= 0) {
      this.messageBox('Please add ata least 1 source item.');
      return;
    }

    const productionDto = new ButcheryProductionDto();

    productionDto.totalProducedWeightKg = this.totalProducedWeightKg;
    productionDto.warehouse = this.warehouse;
    productionDto.butcheryProductionItems = this.productionItems;
    productionDto.butcheryProductionSources = this.productionSources;

    this.productionsService
      .postProduction(productionDto)
      .subscribe(this.onProcessSavedProduction());
  }

  onProcessSavedProduction() {
    return (res: ButcheryProduction) => {
      this.production.butcheryProductionId = res.butcheryProductionId;
      this.production.productionStatus = res.productionStatus;
      this.production.totalProducedWeightKg = res.totalProducedWeightKg;
      this.productionDetailsConfig.setParams(res.productionStatus);
      this.production.dateCreated = res.dateCreated;
      this.productionItems = res.butcheryProductionItems;
      this.productionSources = res.butcheryProductionSourceViews;
      this.dataHaveChanged = true;
    };
  }

  updateProductionSourceObj(
    pSource: ButcheryProductionSource,
    productionSource: ButcheryProductionSource
  ) {
    for (const key in this.productionItems) {
      if (pSource === this.productionItems[key]) {
        this.productionSources[key].requiredQty = productionSource.requiredQty;
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
                      this.removeItemObj(pItem);
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
                this.removeItemObj(pItem);
              }
            },
          },
        ],
      })
      .then((res) => {
        res.present();
      });
  }

  removeItemObj(pItem: ButcheryProductionItem) {
    for (const key in this.productionItems) {
      if (pItem === this.productionItems[key]) {
        this.productionItems.splice(Number(key), 1);
      }
    }
    this.getTotalAmt();
  }

  onDeleteProductionSource(pSource: ButcheryProductionSource) {
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
              if (pSource.butcheryProductionSourceId !== undefined) {
                pSource.butcheryProduction = this.production;
                this.productionsService
                  .deleteProductionSource(pSource)
                  .subscribe((res) => {
                    this.dataHaveChanged = true;
                    this.production.productionStatus = res.productionStatus;
                    if (this.production.productionStatus === 'Unposted') {
                      this.removeSourceObj(pSource);
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
                this.removeSourceObj(pSource);
              }
            },
          },
        ],
      })
      .then((res) => {
        res.present();
      });
  }

  removeSourceObj(pSource: ButcheryProductionSource) {
    for (const key in this.productionSources) {
      if (pSource === this.productionSources[key]) {
        this.productionSources.splice(Number(key), 1);
      }
    }
  }

  getTotalAmt() {
    this.totalProducedWeightKg = 0;
    this.productionItems.forEach((itm) => {
      this.totalProducedWeightKg += itm.producedWeightKg;
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
