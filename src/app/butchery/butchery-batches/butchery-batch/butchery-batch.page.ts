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

      if (this.butcheryBatch.butcheryBatchId > 0) {
        this.butcheryBatchesService
          .getButcheryBatch(this.butcheryBatch.butcheryBatchId)
          .subscribe({
            next: (res) => {
              this.butcheryBatch = res.butcheryBatch;
              this.butcheryBatchDetails =
                res.butcheryBatch.butcheryBatchDetails;
              this.dateValue = format(
                parseISO(res.butcheryBatch.dateReceived),
                'MMMM dd, yyyy'
              );
            },
            error: () => {
              this.updateForm();
            },
            complete: () => {
              this.updateForm();
            },
          });
      } else {
        this.updateForm();
      }
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
            if (this.butcheryBatch.butcheryBatchId > 0) {
              const butcherBatch = new ButcheryBatch();
              const butcheryBatchDto = new ButcheryBatchDto();

              butcherBatch.butcheryBatchId = this.butcheryBatch.butcheryBatchId;

              butcheryBatchDto.butcheryBatch = butcherBatch;
              butcheryBatchDto.butcheryBatchDetail = modal.data;

              this.butcheryBatchesService
                .postButcheryBatchDetail(butcheryBatchDto)
                .subscribe({
                  next: (res) => {
                    this.messageBox(
                      'Batch detail information has been saved successfully.'
                    );
                    this.butcheryBatchDetails =
                      this.butcheryBatchDetails.concat(res.butcheryBatchDetail);
                  },
                  error: () => {
                    this.modalOpen = false;
                  },
                  complete: () => {
                    this.modalOpen = false;
                  },
                });
            } else {
              this.butcheryBatchDetails = this.butcheryBatchDetails.concat(
                modal.data
              );
              this.modalOpen = false;
            }
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

            if (this.butcheryBatch.butcheryBatchId > 0) {
              const butcheryBatchDto = new ButcheryBatchDto();

              butcheryBatchDto.butcheryBatchDetail = detail;

              this.butcheryBatchesService
                .postButcheryBatchDetail(butcheryBatchDto)
                .subscribe({
                  next: (res) => {
                    this.messageBox(
                      'Batch detail information has been saved successfully.'
                    );
                  },
                  error: () => {
                    this.modalOpen = false;
                  },
                  complete: () => {
                    this.modalOpen = false;
                  },
                });
            } else {
              this.modalOpen = false;
            }
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
              text: 'Cancel',
            },
            {
              text: 'Delete',
              handler: () => {
                if (detail.butcheryBatchDetailId > 0) {
                  const butcheryBatchDto = new ButcheryBatchDto();
                  butcheryBatchDto.butcheryBatchDetail = detail;

                  this.butcheryBatchesService
                    .deleteButcheryBatchDetail(butcheryBatchDto)
                    .subscribe({
                      next: (res) => {
                        for (const key in this.butcheryBatchDetails) {
                          if (detail === this.butcheryBatchDetails[key]) {
                            this.butcheryBatchDetails.splice(Number(key), 1);
                          }
                        }
                        this.messageBox(
                          'Batch detail item has been deleted successfully.'
                        );
                      },
                      error: () => {},
                      complete: () => {},
                    });
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
            if (detail.butcheryBatchDetailId > 0) {
              const butcheryBatchDto = new ButcheryBatchDto();

              butcheryBatchDto.butcheryBatchDetail = detail;
              butcheryBatchDto.butcheryBatchDetailItem = modal.data;

              this.butcheryBatchesService
                .postButcheryBatchDetailItem(butcheryBatchDto)
                .subscribe({
                  next: (res) => {
                    this.messageBox(
                      'Batch detail item information has been saved successfully.'
                    );
                    detail.butcheryBatchDetailItems =
                      detail.butcheryBatchDetailItems.concat(
                        res.butcheryBatchDetailItem
                      );
                  },
                  error: () => {
                    this.modalOpen = false;
                  },
                  complete: () => {
                    this.modalOpen = false;
                  },
                });
            } else {
              detail.butcheryBatchDetailItems =
                detail.butcheryBatchDetailItems.concat(modal.data);

              this.modalOpen = false;
            }
          }
          this.modalOpen = false;
        });
    }
  }

  onEditBatchDetailItem(
    detailItem: ButcheryBatchDetailitem,
    detail?: ButcheryBatchDetail
  ) {
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
          if (modal.role === 'saveDetailItem') {
            detailItem.item = modal.data.item;
            detailItem.requiredUom = modal.data.requiredUom;
            detailItem.requiredQty = modal.data.requiredQty;
            detailItem.receivedQty = modal.data.receivedQty;
            detailItem.requiredWeightKg = modal.data.requiredWeightKg;
            detailItem.receivedWeightKg = modal.data.receivedWeightKg;

            if (detail.butcheryBatchDetailId > 0) {
              const butcheryBatchDto = new ButcheryBatchDto();
              const batchDetail = new ButcheryBatchDetail();

              batchDetail.butcheryBatchDetailId = detail.butcheryBatchDetailId;

              butcheryBatchDto.butcheryBatchDetail = batchDetail;
              butcheryBatchDto.butcheryBatchDetailItem = detailItem;

              this.butcheryBatchesService
                .postButcheryBatchDetailItem(butcheryBatchDto)
                .subscribe({
                  next: (res) => {
                    this.messageBox(
                      'Batch detail information has been saved successfully.'
                    );
                    detail.totalRequiredWeightKg = res.butcheryBatchDetail.totalRequiredWeightKg;
                    detail.totalReceivedWeightKg = res.butcheryBatchDetail.totalReceivedWeightKg;
                  },
                  error: () => {
                    this.modalOpen = false;
                  },
                  complete: () => {
                    this.modalOpen = false;
                  },
                });
            } else {
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
    if (!this.modalOpen) {
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
                  const butcheryBatchDto = new ButcheryBatchDto();
                  butcheryBatchDto.butcheryBatchDetailItem = detailItem;

                  this.butcheryBatchesService
                    .deleteButcheryBatchDetailItem(butcheryBatchDto)
                    .subscribe({
                      next: (res) => {
                        for (const key in detailItems) {
                          if (detailItem === detailItems[key]) {
                            detailItems.splice(Number(key), 1);
                          }
                        }
                        this.messageBox(
                          'Batch detail item has been deleted successfully.'
                        );
                      },
                      error: () => {},
                      complete: () => {},
                    });
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

      this.butcheryBatch.createdBy =
        this.authenticationService.getUserFromLocalCache();
      butcheryBatchDto.butcheryBatch = this.butcheryBatch;

      if (this.butcheryBatch.butcheryBatchId === 0) {
        butcheryBatchDto.butcheryBatch.butcheryBatchDetails =
          this.butcheryBatchDetails;
      }

      this.butcheryBatchesService
        .postButcheryBatch(butcheryBatchDto)
        .subscribe({
          next: (res) => {
            this.butcheryBatch.butcheryBatchId =
              res.butcheryBatch.butcheryBatchId;
            this.butcheryBatch.batchStatus = res.butcheryBatch.batchStatus;
            this.butcheryBatch.hasInventory = res.butcheryBatch.hasInventory;
            this.butcheryBatch.isOpen = res.butcheryBatch.isOpen;
            this.butcheryBatchDetails = res.butcheryBatch.butcheryBatchDetails;
          },
          error: (err) => {
            this.isUploading = false;
          },
          complete: () => {
            this.isUploading = false;
            this.updateForm();
            this.messageBox('Batch information has been saved successfully.');
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
