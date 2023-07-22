import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController, ToastController } from '@ionic/angular';
import { Vendor } from 'src/app/classes/vendor.model';
import { VendorSearchComponent } from 'src/app/vendors/vendor-search/vendor-search.component';
import { ButcheryBatchDetail } from '../../classes/butchery-batch-detail.model';
import { ButcheryBatchDetailitem } from '../../classes/butchery-batch-detail-item.model';

@Component({
  selector: 'app-butchery-batch-detail',
  templateUrl: './butchery-batch-detail.component.html',
  styleUrls: ['./butchery-batch-detail.component.scss'],
})
export class ButcheryBatchDetailComponent implements OnInit {
  batchDetail: ButcheryBatchDetail;

  contentForm: FormGroup;

  modalOpen = false;

  constructor(
    private modalController: ModalController,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    if (this.batchDetail === undefined) {
      this.batchDetail = new ButcheryBatchDetail();
      this.batchDetail.butcheryBatchDetailId = 0;
      this.batchDetail.vendor = new Vendor();

      const detailItem: ButcheryBatchDetailitem[] = [];
      this.batchDetail.butcheryBatchDetailItems = detailItem;
    }

    this.contentForm = new FormGroup({
      vendor: new FormControl(this.batchDetail.vendor, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      referenceNo: new FormControl(this.batchDetail.referenceNo),
    });
  }

  onVendorSearch() {
    if (!this.modalOpen) {
      this.modalOpen = true;

      this.modalController
        .create({
          component: VendorSearchComponent,
          cssClass: 'custom-modal-styles',
        })
        .then((mdl) => {
          mdl.present();
          return mdl.onDidDismiss();
        })
        .then((modal) => {
          if (modal.role === 'vendor') {
            this.contentForm.patchValue({
              vendor: modal.data
            });
          }
          this.modalOpen = false;
        });
    }
  }

  onSaveBatchDetail() {
    if (this.contentForm.valid) {
      this.batchDetail.vendor = this.contentForm.value.vendor;
      this.batchDetail.referenceNo = this.contentForm.value.referenceNo;

      this.modalController.dismiss(this.batchDetail, 'saveBatcherDetail');
    } else {
      this.messageBox('Some fields contain invalid information.');
    }
  }

  dismissModal() {
    this.modalController.dismiss(null, 'dismissModal');
  }

  async messageBox(msg: string) {
    const toast = await this.toastController.create({
      color: 'dark',
      duration: 2000,
      position: 'top',
      message: msg,
    });

    await toast.present();
  }
}
