import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  AlertController,
  IonInput,
  IonPopover,
  IonSearchbar,
  ModalController,
  NavController,
  ToastController,
} from '@ionic/angular';
import { Vendor } from 'src/app/classes/vendor.model';
import { ItemDto } from 'src/app/classes/item-dto.model';
import { Warehouse } from 'src/app/classes/warehouse.model';
import { ItemsService } from 'src/app/services/items.service';
import { ButcheryReceivingDto } from '../../classes/butchery-receiving-dto.model';
import { ButcheryReceivingItem } from '../../classes/butchery-receiving-item.model';
import { ButcheryReceiving } from '../../classes/butchery-receiving.model';
import { ReceivingDetailsConfig } from '../../config/receiving-details.config';
import { ButcheryReceivingsService } from '../../services/butchery-receivings.service';
import { ReceivedItemComponent } from '../received-item/received-item.component';
import { ReceivedItemDetail } from '../received-item/received-item.model';
import { ReceivedItemService } from '../received-item/received-item.service';
import { filterString } from '../../utils/utils';
import { ButcheryProduction } from '../../classes/butchery-production.model';
import { WarehousesService } from 'src/app/services/warehouses.service';
import { User } from 'src/app/Security/classes/user.model';
import { AuthenticationService } from 'src/app/Security/services/authentication.service';
import { VendorWarehouse } from 'src/app/classes/vendor-warehouse.model';
import { VendorWarehouseSearchComponent } from 'src/app/vendor-warehouses/vendor-warehouse-search/vendor-warehouse-search.component';

@Component({
  selector: 'app-receiving-detail',
  templateUrl: './receiving-detail.page.html',
  styleUrls: ['./receiving-detail.page.scss'],
})
export class ReceivingDetailPage implements OnInit, OnDestroy {
  @ViewChild('statusPopover') statusPopover: IonPopover;
  @ViewChild('referenceCodeInput') referenceCodeInput: IonInput;
  @ViewChild('itemSearchBar') itemSearchBar: IonSearchbar;

  statusPopoverOpen = false;

  receiving: ButcheryReceiving;
  warehouse: Warehouse;
  vendorWarehouse: VendorWarehouse;
  user: User;
  productions: ButcheryProduction[] = [];
  receivingItems: ButcheryReceivingItem[] = [];
  receivingDetailsConfig: ReceivingDetailsConfig;

  isUploading = false;
  dataHaveChanged = false;
  isFetching = false;
  modalOpen = false;

  totalKg = 0;
  totalProductionItemQty = 0;
  totalProductionSourceQty = 0;

  constructor(
    private itemsService: ItemsService,
    private receivedItemService: ReceivedItemService,
    private receivingsService: ButcheryReceivingsService,
    private warehousesService: WarehousesService,
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private modalSearch: ModalController,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.isFetching = true;

    this.receiving = new ButcheryReceiving();
    this.warehouse = new Warehouse();
    this.vendorWarehouse = new VendorWarehouse();
    this.receivingDetailsConfig = new ReceivingDetailsConfig();

    this.route.paramMap.subscribe((paramMap) => {
      if (!paramMap.has('butcheryReceivingId')) {
        this.navCtrl.navigateBack('/tabs/receivings');
        return;
      }

      if (isNaN(Number(paramMap.get('butcheryReceivingId')))) {
        this.navCtrl.navigateBack('/tabs/receivings');
        return;
      }

      const butcheryReceivingId = Number(paramMap.get('butcheryReceivingId'));
      if (butcheryReceivingId > 0) {
        this.receivingsService.getReceiving(butcheryReceivingId).subscribe({
          next: (resData) => {
            if (!resData.butcheryReceivingId) {
              this.navCtrl.navigateBack('/tabs/receivings');
              return;
            }
            this.receiving.butcheryReceivingId = resData.butcheryReceivingId;
            this.receiving.referenceCode = resData.referenceCode;
            this.receiving.totalKg = resData.totalKg;
            this.receiving.receivingStatus = resData.receivingStatus;
            this.receivingDetailsConfig.setParams(resData.receivingStatus);
            this.receiving.dateCreated = resData.dateCreated;
            this.warehouse = resData.warehouse;
            this.vendorWarehouse = resData.vendorWarehouse;
            this.receivingItems = resData.butcheryReceivingItems;
            this.totalKg = this.receiving.totalKg;
            this.isFetching = false;
          },
          error: (err) => {
            this.navCtrl.navigateBack('/tabs/receivings');
            return;
          },
        });
      } else {
        // this.receiving.receivingStatus = 'Unposted';
        this.user = this.authenticationService.getUserFromLocalCache();
        this.warehousesService
          .getWarehouseByUserId(this.user.userId)
          .subscribe({
            next: (res) => {
              this.warehouse.warehouseId = res.warehouseId;
              this.warehouse.warehouseName = res.warehouseName;
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

  onVendorWarehouseSearch() {
    if (
      !this.modalOpen &&
      !this.isUploading
    ) {
      this.modalOpen = true;
      this.modalSearch
        .create({
          component: VendorWarehouseSearchComponent,
          cssClass: 'custom-modal-styles',
        })
        .then((modalSearch) => {
          modalSearch.present();
          return modalSearch.onDidDismiss();
        })
        .then((resultData) => {
          if (resultData.role === 'vendorWarehouse') {
            this.vendorWarehouse = resultData.data;
          }
          this.modalOpen = false;
        });
    }
  }

  onGetItemByItemCode(event) {
    if (event && event.key === 'Enter') {
      const fullBarcode = filterString(this.itemSearchBar.value);

      if (fullBarcode.length >= 1) {
        this.itemsService.getItemByItemCode(fullBarcode).subscribe((res) => {
          if (res.item) {
            this.addReceivingItem(res, fullBarcode, 1);
          } else {
            this.messageBox('Item not found!');
          }
        });
      }

      this.itemSearchBar.value = '';
    }
  }

  addReceivingItem(itemDto: ItemDto, barcode = '', itemQty = 0) {
    const receivedItemDetail = new ReceivedItemDetail();

    receivedItemDetail.item = itemDto.item;
    receivedItemDetail.uom = itemDto.item.uom;
    receivedItemDetail.documentedQty = 0;
    receivedItemDetail.receivedQty = 0;
    receivedItemDetail.documentedWeightKg = 0;
    receivedItemDetail.receivedWeightKg = 0;
    receivedItemDetail.usedQty = 0;
    receivedItemDetail.remarks = '';
    receivedItemDetail.isAvailable = false;
    this.onManuallyAddReceivedItem(receivedItemDetail);
  }

  onManuallyAddReceivedItem(receivingItem?: ReceivedItemDetail) {
    if (!this.modalOpen) {
      this.modalOpen = true;
      this.receivedItemService.receivedItemDetail.next(receivingItem);

      this.modalSearch
        .create({
          component: ReceivedItemComponent,
          cssClass: 'custom-modal-styles',
          // componentProps: { batch: this.butcheryBatch },
        })
        .then((modalSearch) => {
          modalSearch.present();
          return modalSearch.onDidDismiss();
        })
        .then((resultData) => {
          if (resultData.role === 'item') {
            const item: ReceivedItemDetail = resultData.data;
            const receivedItem = new ButcheryReceivingItem();
            receivedItem.item = item.item;
            receivedItem.barcode = item.item.itemCode;
            receivedItem.itemClass = item.item.itemClass;
            receivedItem.baseUom = item.item.uom;
            receivedItem.baseQty = 1;
            receivedItem.requiredUom = item.uom;
            receivedItem.documentedQty = item.documentedQty;
            receivedItem.receivedQty = item.receivedQty;
            receivedItem.documentedWeightKg = item.documentedWeightKg;
            receivedItem.receivedWeightKg = item.receivedWeightKg;
            receivedItem.usedQty = item.usedQty;
            receivedItem.remarks = item.remarks;
            receivedItem.isAvailable = item.isAvailable;

            if (this.receiving.butcheryReceivingId) {
              receivedItem.butcheryReceiving = this.receiving;
              this.receivingsService
                .putReceivingItem(receivedItem)
                .subscribe((res) => {
                  this.dataHaveChanged = true;
                  this.receiving.receivingStatus = res.receivingStatus;
                  if (this.receiving.receivingStatus === 'Unposted') {
                    this.receivingItems.unshift(res.butcheryReceivingItem);

                    this.getTotalAmt();
                    this.messageBox('New receivedd item has been added.');
                  } else {
                    this.messageBox(
                      'Unable to update the received since its status has been tagged as ' +
                        this.receiving.receivingStatus
                    );
                  }
                });
            } else {
              this.receivingItems.unshift(receivedItem);

              this.getTotalAmt();
            }
          }
          this.modalOpen = false;
        });
    }
  }

  onUpdateStatus(newStatus: string) {
    if (!this.isUploading) {
      this.isUploading = true;
      const receivingDto = new ButcheryReceivingDto();

      receivingDto.butcheryReceivingId = this.receiving.butcheryReceivingId;
      receivingDto.referenceCode = this.receiving.referenceCode;
      receivingDto.receivingStatus = newStatus;

      this.receivingsService.putReceivingSetStatus(receivingDto).subscribe({
        next: (res) => {
          if (res.errorDescription) {
            this.messageBox(res.errorDescription);
            this.isUploading = false;
            return;
          }
          this.dataHaveChanged = true;
          if (res.receivingStatus === 'Unposted') {
            this.receiving.receivingStatus = newStatus;
            this.receivingDetailsConfig.setParams(newStatus);
            this.messageBox(
              `ButcheryReceiving has been ${newStatus.toLowerCase()} successfully.`
            );
          } else {
            this.receiving.receivingStatus = res.receivingStatus;
            this.receivingDetailsConfig.setParams(res.receivingStatus);
            this.messageBox(
              'Unable to update the receiving since its status has been tagged as ' +
                this.receiving.receivingStatus
            );
          }
          this.isUploading = false;
        },
       error: (err) => {
          this.dataHaveChanged = true;
          this.messageBox(
            'An error occured while trying to update the receiving detail.'
          );
          this.isUploading = false;
        }
      });
    }
  }

  onUpdateRefCode() {
    if (this.isUploading) {
      return;
    }

    const refCode = String(this.referenceCodeInput.value);

    if (refCode.trim() === '') {
      this.messageBox('Please provide a reference code.');
      return;
    }

    this.isUploading = true;

    if (this.receiving.butcheryReceivingId) {
      const receivingDto = new ButcheryReceivingDto();
      receivingDto.butcheryReceivingId = this.receiving.butcheryReceivingId;
      receivingDto.referenceCode = refCode;
      this.dataHaveChanged = true;

      this.receivingsService.putReceiving(receivingDto).subscribe((res) => {
        this.receiving.receivingStatus = res.receivingStatus;
        if (this.receiving.receivingStatus === 'Unposted') {
          this.messageBox(`Reference code has been updated successfully.`);
        } else {
          this.messageBox(
            'Unable to update the receiving since its status has been tagged as ' +
              this.receiving.receivingStatus
          );
        }
        this.isUploading = false;
      });
    }
  }

  onSaveReceiving() {
    if (this.isUploading) {
      return;
    }

    if (!this.warehouse.warehouseId) {
      this.messageBox('Please choose a warehouse.');
      return;
    }

    if (!this.vendorWarehouse.vendorWarehouseId) {
      this.messageBox('Please choose a storage provider.');
      return;
    }

    const refCode = String(this.referenceCodeInput.value);

    if (refCode.trim() === '') {
      this.messageBox('Please provide a reference code.');
      return;
    }

    if (this.receivingItems.length <= 0) {
      this.messageBox('Please add at least 1 receiving item.');
      return;
    }

    this.isUploading = true;

    const receivingDto = new ButcheryReceivingDto();

    receivingDto.referenceCode = refCode;
    receivingDto.totalKg = this.totalKg;
    receivingDto.warehouse = this.warehouse;
    receivingDto.vendorWarehouse = this.vendorWarehouse;
    receivingDto.butcheryReceivingItems = this.receivingItems;

    this.receivingsService
      .postReceiving(receivingDto)
      .subscribe(this.onProcessSavedReceiving());
  }

  onProcessSavedReceiving() {
    return (res: ButcheryReceiving) => {
      this.receiving.butcheryReceivingId = res.butcheryReceivingId;
      this.receiving.receivingStatus = res.receivingStatus;
      this.receiving.referenceCode = res.referenceCode;
      this.receiving.totalKg = res.totalKg;
      this.receivingDetailsConfig.setParams(res.receivingStatus);
      this.receiving.dateCreated = res.dateCreated;
      this.receivingItems = res.butcheryReceivingItems;
      this.dataHaveChanged = true;
      this.isUploading = false;
    };
  }

  onUpdateReceivedItem(pItem?: ButcheryReceivingItem) {
    if (!this.modalOpen) {
      this.modalOpen = true;

      const receivedItemDetail = new ReceivedItemDetail();

      receivedItemDetail.item = pItem.item;
      receivedItemDetail.uom = pItem.requiredUom;
      receivedItemDetail.documentedQty = pItem.documentedQty;
      receivedItemDetail.receivedQty = pItem.receivedQty;
      receivedItemDetail.documentedWeightKg = pItem.documentedWeightKg;
      receivedItemDetail.receivedWeightKg = pItem.receivedWeightKg;
      receivedItemDetail.usedQty = pItem.usedQty;
      receivedItemDetail.remarks = pItem.remarks;
      receivedItemDetail.isAvailable = pItem.isAvailable;

      this.receivedItemService.receivedItemDetail.next(receivedItemDetail);

      this.modalSearch
        .create({
          component: ReceivedItemComponent,
          cssClass: 'custom-modal-styles',
        })
        .then((modalSearch) => {
          modalSearch.present();
          return modalSearch.onDidDismiss();
        })
        .then((resultData) => {
          if (resultData.role === 'item') {
            const item: ReceivedItemDetail = resultData.data;
            const receivedItem = new ButcheryReceivingItem();

            receivedItem.item = item.item;
            receivedItem.barcode = item.item.itemCode;
            receivedItem.requiredUom = item.uom;
            receivedItem.documentedQty = item.documentedQty;
            receivedItem.receivedQty = item.receivedQty;
            receivedItem.documentedWeightKg = item.documentedWeightKg;
            receivedItem.receivedWeightKg = item.receivedWeightKg;
            receivedItem.usedQty = item.usedQty;
            receivedItem.remarks = item.remarks;
            receivedItem.isAvailable = item.isAvailable;

            if (this.receiving.butcheryReceivingId) {
              receivedItem.butcheryReceivingItemId =
                pItem.butcheryReceivingItemId;
              receivedItem.butcheryReceiving = this.receiving;
              this.receivingsService
                .putReceivingItem(receivedItem)
                .subscribe((res) => {
                  this.dataHaveChanged = true;
                  this.receiving.receivingStatus = res.receivingStatus;
                  if (this.receiving.receivingStatus === 'Unposted') {
                    this.updateReceivingItemObj(pItem, receivedItem);
                    this.getTotalAmt();
                    this.messageBox('Received item has been updated.');
                  } else {
                    this.messageBox(
                      'Unable to update since its status has been tagged as ' +
                        this.receiving.receivingStatus
                    );
                  }
                });
            } else {
              this.updateReceivingItemObj(pItem, receivedItem);
              this.getTotalAmt();
            }
          }
          this.modalOpen = false;
        });
    }
  }

  updateReceivingItemObj(
    pItem: ButcheryReceivingItem,
    receivingItem: ButcheryReceivingItem
  ) {
    for (const key in this.receivingItems) {
      if (pItem === this.receivingItems[key]) {
        this.receivingItems[key].item = receivingItem.item;
        this.receivingItems[key].barcode = receivingItem.barcode;
        this.receivingItems[key].requiredUom = receivingItem.requiredUom;
        this.receivingItems[key].documentedQty = receivingItem.documentedQty;
        this.receivingItems[key].receivedQty = receivingItem.receivedQty;
        this.receivingItems[key].documentedWeightKg =
          receivingItem.documentedWeightKg;
        this.receivingItems[key].receivedWeightKg =
          receivingItem.receivedWeightKg;
        this.receivingItems[key].usedQty = receivingItem.usedQty;
        this.receivingItems[key].remarks = receivingItem.remarks;
        this.receivingItems[key].isAvailable = receivingItem.isAvailable;
      }
    }
  }

  onDeleteReceivingItem(pItem: ButcheryReceivingItem) {
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
              if (pItem.butcheryReceivingItemId !== undefined) {
                pItem.butcheryReceiving = this.receiving;
                this.receivingsService
                  .deleteReceivingItem(pItem)
                  .subscribe((res) => {
                    this.dataHaveChanged = true;
                    this.receiving.receivingStatus = res.receivingStatus;
                    if (this.receiving.receivingStatus === 'Unposted') {
                      this.removeMenuObj(pItem);
                      this.messageBox(
                        'ButcheryReceiving item has been deleted successfully.'
                      );
                    } else {
                      this.messageBox(
                        'Unable to delete the receiving item since receiving has been tagged as ' +
                          this.receiving.receivingStatus
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

  removeMenuObj(pItem: ButcheryReceivingItem) {
    for (const key in this.receivingItems) {
      if (pItem === this.receivingItems[key]) {
        this.receivingItems.splice(Number(key), 1);
      }
    }
    this.getTotalAmt();
  }

  getTotalAmt() {
    this.totalKg = 0;
    this.receivingItems.forEach((itm) => {
      this.totalKg += itm.receivedWeightKg;
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
      this.receivingsService.receivingsHaveChanged.next(true);
    }
  }
}
