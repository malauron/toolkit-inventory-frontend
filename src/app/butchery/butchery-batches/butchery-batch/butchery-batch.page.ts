import { Component, OnInit } from '@angular/core';
import {
  AlertController,
  ModalController,
  NavController,
  ToastController,
} from '@ionic/angular';
import { format, parseISO } from 'date-fns';
import { DatePickerComponent } from 'src/app/custom-controls/date-picker/date-picker.component';
import { VendorWarehouseSearchComponent } from 'src/app/vendor-warehouses/vendor-warehouse-search/vendor-warehouse-search.component';
import { ButcheryBatchDetailComponent } from '../butchery-batch-detail/butchery-batch-detail.component';
import { ButcheryBatchDetailItemComponent } from '../butchery-batch-detail-item/butchery-batch-detail-item.component';
import { ButcheryBatch } from '../../classes/butchery-batch.model';
import { ActivatedRoute } from '@angular/router';
import { VendorWarehouse } from 'src/app/classes/vendor-warehouse.model';
import { ButcheryBatchesService } from '../../services/butchery-batches.service';
import { ButcheryBatchDto } from '../../classes/butchery-batch-dto.model';
import { AuthenticationService } from 'src/app/Security/services/authentication.service';
import { ButcheryBatchDetail } from '../../classes/butchery-batch-detail.model';
import { ButcheryBatchDetailitem } from '../../classes/butchery-batch-detail-item.model';

@Component({
  selector: 'app-butchery-batch',
  templateUrl: './butchery-batch.page.html',
  styleUrls: ['./butchery-batch.page.scss'],
})
export class ButcheryBatchPage implements OnInit {
  pageLabel = 'Batch';

  butcheryBatch: ButcheryBatch;
  butcheryBatchDetails: ButcheryBatchDetail[] = [];

  modalOpen = false;
  isUploading = false;
  showElems = true;

  dateValue;

  pushLg = 0;
  pullLg = 0;

  constructor(
    public route: ActivatedRoute,
    private navCtrl: NavController,
    private mdl: ModalController,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private butcheryBatchesService: ButcheryBatchesService,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap) => {
      // Check whether paramMap is empty or not
      if (!paramMap.has('batchId')) {
        this.navCtrl.navigateBack('/tabs/butchery-batches');
        return;
      }

      // Check if paramMap is a number
      if (isNaN(Number(paramMap.get('batchId')))) {
        this.navCtrl.navigateBack('/tabs/butchery-batches');
        return;
      }

      this.butcheryBatch = new ButcheryBatch();
      this.butcheryBatch.butcheryBatchId = Number(paramMap.get('batchId'));
      this.butcheryBatch.vendorWarehouse = new VendorWarehouse();

      this.updateForm();
    });
  }

  updateForm() {
    if (this.butcheryBatch.butcheryBatchId === 0) {
      this.pushLg = 6;
      this.pullLg = 6;
      this.showElems = false;
    } else {
      this.pushLg = 0;
      this.pullLg = 0;
      this.showElems = true;
    }
  }

  showReceivedDatePicker() {
    if (!this.modalOpen) {
      this.modalOpen = true;
      this.mdl
        .create({
          component: DatePickerComponent,
          cssClass: 'custom-modal-styles',
        })
        .then((modal) => {
          modal.present();
          return modal.onDidDismiss();
        })
        .then((modal) => {
          if (modal.role === 'setDate') {
            this.butcheryBatch.dateReceived = modal.data;
            this.dateValue = format(parseISO(modal.data), 'MMMM dd, yyyy');
          }
          this.modalOpen = false;
        });
    }
  }

  onVendorWarehouseSearch() {
    if (!this.modalOpen) {
      this.modalOpen = true;
      this.mdl
        .create({ component: VendorWarehouseSearchComponent })
        .then((modalSearch) => {
          modalSearch.present();
          return modalSearch.onDidDismiss();
        })
        .then((resultData) => {
          if (resultData.role === 'vendorWarehouse') {
            this.butcheryBatch.vendorWarehouse = resultData.data;
          }
          this.modalOpen = false;
        });
    }
  }

  onShowBatchDetail() {
    if (!this.modalOpen) {
      this.modalOpen = true;
      this.mdl
        .create({
          component: ButcheryBatchDetailComponent,
          cssClass: 'custom-modal-styles',
        })
        .then((modal) => {
          modal.present();
          return modal.onDidDismiss();
        })
        .then((modal) => {
          if (modal.role === 'saveBatcherDetail') {
            this.butcheryBatchDetails = this.butcheryBatchDetails.concat(
              modal.data
            );
          }
          this.modalOpen = false;
        });
    }
  }

  onEditBatchDetail(detail: ButcheryBatchDetail) {
    if (!this.modalOpen) {
      this.modalOpen = true;
      this.mdl
        .create({
          component: ButcheryBatchDetailComponent,
          cssClass: 'custom-modal-styles',
          componentProps: {
            batchDetail: detail,
          },
        })
        .then((modal) => {
          modal.present();
          return modal.onDidDismiss();
        })
        .then((modal) => {
          if (modal.role === 'saveBatcherDetail') {
            detail.vendor = modal.data.vendor;
            detail.referenceNo = modal.data.referenceNo;
            this.modalOpen = false;
          } else {
            this.modalOpen = false;
          }
        });
    }
  }

  onDeleteBatchDetail(detail: ButcheryBatchDetail) {
    if (!this.modalOpen) {
      this.modalOpen = true;
      this.alertCtrl
        .create({
          header: 'Confirm',
          message: 'This will be deleted permanently.',
          buttons: [
            {
              text: 'Cancel'
            },
            {
              text: 'Delete',
              handler: () => {
                if (detail.butcheryBatchDetailId > 0) {
                  // this.addOnsService
                  //   .deleteItemAddOnDetails(itemAddOnDetail.itemAddOnDetailId)
                  //   .subscribe((res) => {
                  //     for (const key in this.addOnsService.getItemAddOnDetails()) {
                  //       if (
                  //         itemAddOnDetail ===
                  //         this.addOnsService.getItemAddOnDetails()[key]
                  //       ) {
                  //         this.addOnsService
                  //           .getItemAddOnDetails()
                  //           .splice(Number(key), 1);
                  //       }
                  //     }
                  //   });
                } else {
                  for (const key in this.butcheryBatchDetails) {
                    if (detail === this.butcheryBatchDetails[key]) {
                      this.butcheryBatchDetails.splice(Number(key), 1);
                    }
                  }
                }
              },
            },
          ],
        })
        .then((modal) => {
          modal.present();
          return modal.onDidDismiss();
        })
        .then((modal) => {
          this.modalOpen = false;
        });
    }
  }

  onShowBatchDetailItem(detail: ButcheryBatchDetail) {
    if (!this.modalOpen) {
      this.modalOpen = true;
      this.mdl
        .create({
          component: ButcheryBatchDetailItemComponent,
          cssClass: 'custom-modal-styles',
        })
        .then((modal) => {
          modal.present();
          return modal.onDidDismiss();
        })
        .then((modal) => {
          if (modal.role === 'saveDetailItem') {
            detail.butcheryBatchDetailItems =
              detail.butcheryBatchDetailItems.concat(modal.data);
          }
          this.modalOpen = false;
        });
    }
  }

  onEditBatchDetailItem(detailItem: ButcheryBatchDetailitem) {
    if (!this.modalOpen) {
      this.modalOpen = true;
      this.mdl
        .create({
          component: ButcheryBatchDetailItemComponent,
          componentProps: {
            batchDetailItem: detailItem,
          },
          cssClass: 'custom-modal-styles',
        })
        .then((modal) => {
          modal.present();
          return modal.onDidDismiss();
        })
        .then((modal) => {
          if (modal.role === 'saveContent') {
            if (modal.data.itemAddOnContentId > 0) {
              // modal.data.itemAddOnDetail = addOnDetail;
              // this.addOnsService
              //   .postItemAddOnContents(modal.data)
              //   .subscribe((res) => {
              //     content.item = res.item;
              //     content.uom = res.uom;
              //     content.price = res.price;
              //     content.qty = res.qty;
              //     content.altDesc = res.altDesc;
              //   });
              this.modalOpen = false;
            } else {
              detailItem.item = modal.data.item;
              detailItem.requiredUom = modal.data.requiredUom;
              detailItem.requiredQty = modal.data.requiredQty;
              detailItem.receivedQty = modal.data.receivedQty;
              detailItem.requiredWeightKg = modal.data.requiredWeightKg;
              detailItem.receivedWeightKg = modal.data.receivedWeightKg;
              this.modalOpen = false;
            }
          } else {
            this.modalOpen = false;
          }
        });
    }
  }

  onDeleteBatchDetailItem(
    detailItem: ButcheryBatchDetailitem,
    detailItems: ButcheryBatchDetailitem[]
  ) {
    if (!this.modalOpen){
      this.modalOpen = true;
      this.alertCtrl
        .create({
          header: 'Confirm',
          message: 'This will be deleted permanently.',
          buttons: [
            {
              text: 'Cancel',
            },
            {
              text: 'Delete',
              handler: () => {
                if (detailItem.butcheryBatchDetailItemId > 0) {
                  // this.addOnsService
                  //   .deleteItemAddOnContents(itemAddOnContent.itemAddOnContentId)
                  //   .subscribe((res) => {
                  //     for (const key in allContents) {
                  //       if (itemAddOnContent === allContents[key]) {
                  //         allContents.splice(Number(key), 1);
                  //       }
                  //     }
                  //   });
                } else {
                  for (const key in detailItems) {
                    if (detailItem === detailItems[key]) {
                      detailItems.splice(Number(key), 1);
                    }
                  }
                }
              },
            },
          ],
        })
        .then((modal) => {
          modal.present();
          return modal.onDidDismiss();
        })
        .then((modal) => {
          this.modalOpen = false;
        });
    }
  }

  onSaveButcheryBatch() {
    if (!this.isUploading) {
      this.isUploading = true;
      let noItem = false;

      if (this.butcheryBatch.vendorWarehouse.vendorWarehouseId === undefined) {
        this.messageBox('Please choose a storage provider.');
        this.isUploading = false;
        return;
      }

      if (this.butcheryBatch.dateReceived === undefined) {
        this.messageBox('Please specify the date of receipt.');
        this.isUploading = false;
        return;
      }

      if (this.butcheryBatchDetails.length === 0) {
        this.messageBox('No detail provided.');
        this.isUploading = false;
        return;
      }

      this.butcheryBatchDetails.forEach((dtl) => {
        if (dtl.butcheryBatchDetailItems.length === 0) {
          noItem = true;
        }
      });

      if (noItem) {
        this.messageBox('Some details have no line items.');
        this.isUploading = false;
        return;
      }

      const butcheryBatchDto = new ButcheryBatchDto();
      butcheryBatchDto.butcheryBatchId = this.butcheryBatch.butcheryBatchId;
      butcheryBatchDto.remarks = this.butcheryBatch.remarks;
      butcheryBatchDto.dateReceived = this.butcheryBatch.dateReceived;
      butcheryBatchDto.batchStatus = this.butcheryBatch.batchStatus;
      butcheryBatchDto.hasInventory = this.butcheryBatch.hasInventory;
      butcheryBatchDto.isOpen = this.butcheryBatch.isOpen;
      butcheryBatchDto.vendorWarehouse = this.butcheryBatch.vendorWarehouse;
      butcheryBatchDto.butcheryBatchDetails = this.butcheryBatchDetails;
      butcheryBatchDto.createdBy =
        this.authenticationService.getUserFromLocalCache();

      this.butcheryBatchesService
        .postButcheryBatch(butcheryBatchDto)
        .subscribe({
          next: (res) => {
            this.butcheryBatch.butcheryBatchId = res.butcheryBatchId;
            this.butcheryBatch.batchStatus = res.batchStatus;
            this.butcheryBatch.hasInventory = res.hasInventory;
            this.butcheryBatch.isOpen = res.isOpen;
          },
          error: (err) => {
            this.isUploading = false;
          },
          complete: () => {
            this.isUploading = false;
            this.updateForm();
          },
        });
    }
  }

  async messageBox(msg: string) {
    const toast = await this.toastCtrl.create({
      color: 'dark',
      duration: 2000,
      position: 'top',
      message: msg,
    });

    await toast.present();
  }
}
