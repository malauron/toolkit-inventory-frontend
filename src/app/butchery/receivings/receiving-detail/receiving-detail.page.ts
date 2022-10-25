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
import { VendorSearchComponent } from 'src/app/vendors/vendor-search/vendor-search.component';
import { ItemsService } from 'src/app/services/items.service';
import { WarehouseSearchComponent } from 'src/app/warehouses/warehouse-search/warehouse-search.component';
import { ButcheryReceivingDto } from '../../classes/butchery-receiving-dto.model';
import { ButcheryReceivingItem } from '../../classes/butchery-receiving-item.model';
import { ButcheryReceiving } from '../../classes/butchery-receiving.model';
import { ReceivingDetailsConfig } from '../../config/receiving-details.config';
import { ButcheryReceivingsService } from '../../services/butchery-receivings.service';
import { ReceivedItemComponent } from '../received-item/received-item.component';
import { ReceivedItemDetail } from '../received-item/received-item.model';
import { ReceivedItemService } from '../received-item/received-item.service';
import { filterString } from '../../utils/utils';

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
  vendor: Vendor;
  receivingItems: ButcheryReceivingItem[] = [];
  receivingDetailsConfig: ReceivingDetailsConfig;

  isUploading = false;
  dataHaveChanged = false;
  isFetching = false;
  modalOpen = false;

  totalAmount = 0;

  constructor(
    private itemsService: ItemsService,
    private receivedItemService: ReceivedItemService,
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private receivingsService: ButcheryReceivingsService,
    private modalSearch: ModalController,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.isFetching = true;

    this.receiving = new ButcheryReceiving();

    this.warehouse = new Warehouse();

    this.vendor = new Vendor();

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
        this.receivingsService.getReceiving(butcheryReceivingId).subscribe(
          (resData) => {
            if (!resData.butcheryReceivingId) {
              this.navCtrl.navigateBack('/tabs/receivings');
              return;
            }
            this.receiving.butcheryReceivingId = resData.butcheryReceivingId;
            this.receiving.referenceCode = resData.referenceCode;
            this.receiving.totalAmount = resData.totalAmount;
            this.receiving.receivingStatus = resData.receivingStatus;
            this.receivingDetailsConfig.setParams(resData.receivingStatus);
            this.receiving.dateCreated = resData.dateCreated;
            this.warehouse = resData.warehouse;
            this.vendor = resData.vendor;
            this.receivingItems = resData.butcheryReceivingItems;
            this.totalAmount = this.receiving.totalAmount;
            this.isFetching = false;
          },
          (err) => {
            this.navCtrl.navigateBack('/tabs/receivings');
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
      const fullBarcode = filterString(this.itemSearchBar.value);

      if (fullBarcode.length >= 1 ) {
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
    // const receivingItem = new ButcheryReceivingItem();

    // receivingItem.item = itemDto.item;
    // receivingItem.barcode = barcode;
    // receivingItem.itemClass = itemDto.item.itemClass;
    // receivingItem.baseUom = itemDto.item.uom;
    // receivingItem.baseQty = 1;
    // receivingItem.requiredUom = itemDto.item.uom;
    // receivingItem.receivedQty = itemQty;
    // receivingItem.itemCost = 0;
    // receivingItem.documentedWeight = 0;
    // receivingItem.actualWeight = 0;
    // receivingItem.totalAmount = 0;

    // if (this.receiving.butcheryReceivingId) {
    //   receivingItem.butcheryReceiving = this.receiving;
    // }

    const receivedItemDetail = new ReceivedItemDetail();

    receivedItemDetail.item = itemDto.item;
    receivedItemDetail.uom = itemDto.item.uom;
    receivedItemDetail.receivedQty = 0;
    receivedItemDetail.itemCost = 0;
    receivedItemDetail.documentedWeight = 0;
    receivedItemDetail.actualWeight = 0;
    this.onManuallyAddReceivedItem(receivedItemDetail);
  }

  onManuallyAddReceivedItem(receivingItem?: ButcheryReceivingItem) {
    if (!this.modalOpen) {
      this.modalOpen = true;
      this.receivedItemService.receivedItemDetail.next(receivingItem);
      this.modalSearch
        .create({ component: ReceivedItemComponent })
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
            receivedItem.receivedQty = item.receivedQty;
            receivedItem.itemCost = item.itemCost;
            receivedItem.documentedWeight = item.documentedWeight;
            receivedItem.actualWeight = item.actualWeight;
            receivedItem.totalAmount = item.receivedQty * item.itemCost;

            if (this.receiving.butcheryReceivingId) {
              receivedItem.butcheryReceiving = this.receiving;
              this.receivingsService
                .putReceivingItem(receivedItem)
                .subscribe((res) => {
                  this.dataHaveChanged = true;
                  this.receiving.receivingStatus = res.receivingStatus;
                  if (this.receiving.receivingStatus === 'Unposted') {
                    this.receivingItems = this.receivingItems.concat(
                      res.butcheryReceivingItem
                    );
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
              this.receivingItems = this.receivingItems.concat(receivedItem);
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

      this.receivingsService.putReceivingSetStatus(receivingDto).subscribe(
        (res) => {
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
        (err) => {
          this.dataHaveChanged = true;
          this.messageBox(
            'An error occured while trying to update the receiving detail.'
          );
          this.isUploading = false;
        }
      );
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
            if (this.receiving.butcheryReceivingId) {
              const receivingDto = new ButcheryReceivingDto();
              receivingDto.butcheryReceivingId =
                this.receiving.butcheryReceivingId;
              receivingDto.warehouse = resultData.data;
              this.dataHaveChanged = true;

              this.receivingsService
                .putReceiving(receivingDto)
                .subscribe((res) => {
                  this.receiving.receivingStatus = res.receivingStatus;
                  if (this.receiving.receivingStatus === 'Unposted') {
                    this.warehouse = resultData.data;
                    this.messageBox(
                      `Produced items will be stored to ${this.warehouse.warehouseName}.`
                    );
                  } else {
                    this.messageBox(
                      'Unable to update the receiving since its status has been tagged as ' +
                        this.receiving.receivingStatus
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

  onVendorSearch() {
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
            if (this.receiving.butcheryReceivingId) {
              const receivingDto = new ButcheryReceivingDto();
              receivingDto.butcheryReceivingId =
                this.receiving.butcheryReceivingId;
              receivingDto.vendor = resultData.data;
              this.dataHaveChanged = true;

              this.receivingsService
                .putReceiving(receivingDto)
                .subscribe((res) => {
                  this.receiving.receivingStatus = res.receivingStatus;
                  if (this.receiving.receivingStatus === 'Unposted') {
                    this.vendor = resultData.data;
                    this.messageBox(
                      `Produced items will be delivered to ${this.vendor.vendorName}.`
                    );
                  } else {
                    this.messageBox(
                      'Unable to update the receiving since its status has been tagged as ' +
                        this.receiving.receivingStatus
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
      receivingDto.butcheryReceivingId =
        this.receiving.butcheryReceivingId;
      receivingDto.referenceCode = refCode;
      this.dataHaveChanged = true;

      this.receivingsService
        .putReceiving(receivingDto)
        .subscribe((res) => {
          this.receiving.receivingStatus = res.receivingStatus;
          if (this.receiving.receivingStatus === 'Unposted') {
            this.messageBox(
              `Reference code has been updated successfully.`
            );
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

    if (!this.vendor.vendorId) {
      this.messageBox('Please choose a vendor.');
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
    receivingDto.totalAmount = this.totalAmount;
    receivingDto.warehouse = this.warehouse;
    receivingDto.vendor = this.vendor;
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
      this.receiving.totalAmount = res.totalAmount;
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
      receivedItemDetail.receivedQty = pItem.receivedQty;
      receivedItemDetail.itemCost = pItem.itemCost;
      receivedItemDetail.documentedWeight = pItem.documentedWeight;
      receivedItemDetail.actualWeight = pItem.actualWeight;

      this.receivedItemService.receivedItemDetail.next(receivedItemDetail);

      this.modalSearch
        .create({ component: ReceivedItemComponent })
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
            receivedItem.receivedQty = item.receivedQty;
            receivedItem.itemCost = item.itemCost;
            receivedItem.documentedWeight = item.documentedWeight;
            receivedItem.actualWeight = item.actualWeight;
            receivedItem.totalAmount = item.receivedQty * item.itemCost;


            if (this.receiving.butcheryReceivingId) {
              receivedItem.butcheryReceivingItemId = pItem.butcheryReceivingItemId;
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
    console.log('exe');
    for (const key in this.receivingItems) {
      if (pItem === this.receivingItems[key]) {
        this.receivingItems[key].item = receivingItem.item;
        this.receivingItems[key].barcode = receivingItem.barcode;
        this.receivingItems[key].requiredUom = receivingItem.requiredUom;
        this.receivingItems[key].receivedQty = receivingItem.receivedQty;
        this.receivingItems[key].itemCost = receivingItem.itemCost;
        this.receivingItems[key].documentedWeight = receivingItem.documentedWeight;
        this.receivingItems[key].actualWeight = receivingItem.actualWeight;
        this.receivingItems[key].totalAmount = receivingItem.totalAmount;
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
    this.totalAmount = 0;
    this.receivingItems.forEach((itm) => {
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
      this.receivingsService.receivingsHaveChanged.next(true);
    }
  }
}