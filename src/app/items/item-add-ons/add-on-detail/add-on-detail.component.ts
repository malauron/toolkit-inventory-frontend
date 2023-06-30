import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController, ToastController } from '@ionic/angular';
import { ItemAddOnDetail } from '../classes/item-add-on-detail.model';

@Component({
  selector: 'app-add-on-detail',
  templateUrl: './add-on-detail.component.html',
  styleUrls: ['./add-on-detail.component.scss'],
})
export class AddOnDetailComponent implements OnInit {

  itemAddOnDetail: ItemAddOnDetail;

  detailForm: FormGroup;

  constructor(
    private modalController: ModalController,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    this.itemAddOnDetail = new ItemAddOnDetail();
    this.itemAddOnDetail.itemAddOnDetailId = 0;
    this.itemAddOnDetail.itemAddOnContents = [];

    this.detailForm = new FormGroup({
      description: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(30)]
      }),
      isRequired: new FormControl(false),
      maxNoOfItems: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.min(1), Validators.max(30)]
      })
    });
  }

  onSaveAddOn() {
    if (this.detailForm.valid) {
      this.itemAddOnDetail.description = this.detailForm.value.description;
      this.itemAddOnDetail.isRequired = this.detailForm.value.isRequired;
      this.itemAddOnDetail.maxNoOfItems = this.detailForm.value.maxNoOfItems;

      this.modalController.dismiss(this.itemAddOnDetail, 'saveAddOn');
    } else {
      this.messageBox('Some fields contain invalid infromation.');
    }
  }

  dismissModal() {
    this.modalController.dismiss(null,'dismissModal');
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
