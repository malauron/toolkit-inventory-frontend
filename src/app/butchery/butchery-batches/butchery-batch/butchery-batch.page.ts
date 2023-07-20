import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { format, parseISO } from 'date-fns';
import { DatePickerComponent } from 'src/app/custom-controls/date-picker/date-picker.component';
import { VendorWarehouseSearchComponent } from 'src/app/vendor-warehouses/vendor-warehouse-search/vendor-warehouse-search.component';
import { ButcheryBatchDetailComponent } from '../butchery-batch-detail/butchery-batch-detail.component';
import { ButcheryBatchDetailItemComponent } from '../butchery-batch-detail-item/butchery-batch-detail-item.component';
import { ButcheryBatch } from '../../classes/butchery-batch.mode';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-butchery-batch',
  templateUrl: './butchery-batch.page.html',
  styleUrls: ['./butchery-batch.page.scss'],
})
export class ButcheryBatchPage implements OnInit {
  pageLabel = 'Batch';

  modalOpen = false;
  showElems = true;

  dateValue;

  pushLg = 0;
  pullLg = 0;

  butcheryBatch: ButcheryBatch;

  constructor(
    public route: ActivatedRoute,
    private navCtrl: NavController,
    private mdl: ModalController) {}

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

      if (this.butcheryBatch.butcheryBatchId === 0) {
        this.pushLg = 6;
        this.pullLg = 6;
        this.showElems = false;
      }
    });
  }

  showReceivedDatePicker() {
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
          this.dateValue = format(parseISO(modal.data), 'MMMM dd, yyyy');
        }
      });
  }

  onShowBatchDetail() {
    this.mdl
      .create({
        component: ButcheryBatchDetailComponent,
        cssClass: 'custom-modal-styles',
      })
      .then((modal) => {
        modal.present();
        return modal.onDidDismiss();
      })
      .then((modal) => {});
  }

  onShowBatchDetailItem() {
    this.mdl
      .create({
        component: ButcheryBatchDetailItemComponent,
        cssClass: 'custom-modal-styles',
      })
      .then((modal) => {
        modal.present();
        return modal.onDidDismiss();
      })
      .then((modal) => {});
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
            // if (this.receiving.butcheryReceivingId) {
            //   const receivingDto = new ButcheryReceivingDto();
            //   receivingDto.butcheryReceivingId =
            //     this.receiving.butcheryReceivingId;
            //   receivingDto.warehouse = resultData.data;
            //   this.dataHaveChanged = true;
            //   this.receivingsService
            //     .putReceiving(receivingDto)
            //     .subscribe((res) => {
            //       this.receiving.receivingStatus = res.receivingStatus;
            //       if (this.receiving.receivingStatus === 'Unposted') {
            //         this.warehouse = resultData.data;
            //         this.messageBox(
            //           `Produced items will be stored to ${this.warehouse.warehouseName}.`
            //         );
            //       } else {
            //         this.messageBox(
            //           'Unable to update the receiving since its status has been tagged as ' +
            //             this.receiving.receivingStatus
            //         );
            //       }
            //     });
            // } else {
            //   this.warehouse = resultData.data;
            // }
          }
          this.modalOpen = false;
        });
    }
  }
}
