import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController, ToastController } from '@ionic/angular';
import { Item } from 'src/app/classes/item.model';
import { Uom } from 'src/app/classes/uom.model';
import { UomSearchComponent } from 'src/app/uoms/uom-search/uom-search.component';
import { ItemSearchComponent } from '../../../items/item-search/item-search.component';
import { ItemAddOnContent } from '../../../items/item-add-ons/classes/item-add-on-content.model';
import { ButcheryBatchDetailitem } from '../../classes/butchery-batch-detail-item.model';

@Component({
  selector: 'app-add-on-content',
  templateUrl: './butchery-batch-detail-item.component.html',
  styleUrls: ['./butchery-batch-detail-item.component.scss'],
})
export class ButcheryBatchDetailItemComponent implements OnInit {
  batchDetailItem: ButcheryBatchDetailitem;

  contentForm: FormGroup;

  modalOpen = false;

  constructor(
    private modalController: ModalController,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    if (this.batchDetailItem === undefined) {
      this.batchDetailItem = new ButcheryBatchDetailitem();
      this.batchDetailItem.butcheryBatchDetailItemId = 0;
      this.batchDetailItem.item = new Item();
      this.batchDetailItem.requiredUom = new Uom();
    }

    this.contentForm = new FormGroup({
      item: new FormControl(this.batchDetailItem.item, {
        validators: [Validators.required],
      }),
      requiredUom: new FormControl(this.batchDetailItem.requiredUom, {
        validators: [Validators.required],
      }),
      documentedQty: new FormControl(this.batchDetailItem.documentedQty, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.min(0)],
      }),
      receivedQty: new FormControl(this.batchDetailItem.receivedQty, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.min(0)],
      }),
      documentedWeightKg: new FormControl(this.batchDetailItem.documentedWeightKg, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.min(0)],
      }),
      receivedWeightKg: new FormControl(this.batchDetailItem.receivedWeightKg, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.min(0)],
      }),
    });
  }

  onItemSearch() {
    if (this.modalOpen) {
      return;
    }

    this.modalOpen = true;

    this.modalController
      .create({
        component: ItemSearchComponent,
        cssClass: 'custom-modal-styles',
      })
      .then((mdl) => {
        mdl.present();
        return mdl.onDidDismiss();
      })
      .then((modal) => {
        if (modal.role === 'item') {
          this.contentForm.patchValue({
            item: modal.data,
            requiredUom: modal.data.uom
          });
        }
        this.modalOpen = false;
      });
  }

  onUomSearch(item?: Item) {
    if (this.contentForm.value.item.itemId === undefined) {
      this.messageBox('Please select an item.');
      return;
    }

    if (this.modalOpen) {
      return;
    }

    this.modalOpen = true;

    this.modalController
      .create({
        component: UomSearchComponent,
        componentProps: {
          item: this.contentForm.value.item,
        },
        cssClass: 'custom-modal-styles',
      })
      .then((mdl) => {
        mdl.present();
        return mdl.onDidDismiss();
      })
      .then((mdl) => {
        if (mdl.role === 'itemUom') {
          this.contentForm.patchValue({
            requiredUom: mdl.data.uom
          });
        }
        this.modalOpen = false;
      });
  }

  onSaveAddOnContent() {

    if (this.contentForm.valid) {
      this.batchDetailItem.item = this.contentForm.value.item;
      this.batchDetailItem.requiredUom = this.contentForm.value.requiredUom;
      this.batchDetailItem.documentedQty = this.contentForm.value.documentedQty;
      this.batchDetailItem.receivedQty = this.contentForm.value.receivedQty;
      this.batchDetailItem.documentedWeightKg = this.contentForm.value.documentedWeightKg;
      this.batchDetailItem.receivedWeightKg = this.contentForm.value.receivedWeightKg;

      this.modalController.dismiss(this.batchDetailItem, 'saveDetailItem');
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
