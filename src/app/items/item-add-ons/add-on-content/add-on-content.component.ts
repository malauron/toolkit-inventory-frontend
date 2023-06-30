import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController, ToastController } from '@ionic/angular';
import { Item } from 'src/app/classes/item.model';
import { Uom } from 'src/app/classes/uom.model';
import { UomSearchComponent } from 'src/app/uoms/uom-search/uom-search.component';
import { ItemSearchComponent } from '../../item-search/item-search.component';
import { ItemAddOnContent } from '../classes/item-add-on-content.model';

@Component({
  selector: 'app-add-on-content',
  templateUrl: './add-on-content.component.html',
  styleUrls: ['./add-on-content.component.scss'],
})
export class AddOnContentComponent implements OnInit {
  itemAddOnContent: ItemAddOnContent;

  contentForm: FormGroup;

  modalOpen = false;

  constructor(
    private modalController: ModalController,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.itemAddOnContent = new ItemAddOnContent();
    this.itemAddOnContent.itemAddOnId = 0;
    this.itemAddOnContent.item = new Item();
    this.itemAddOnContent.uom = new Uom();

    this.contentForm = new FormGroup({
      qty: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.min(0.0001)],
      }),
      price: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.min(0)],
      }),
      altDesc: new FormControl(null),
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
          this.itemAddOnContent.item = modal.data;
          this.itemAddOnContent.uom = modal.data.uom;
        }
        this.modalOpen = false;
      });
  }

  onUomSearch(item?: Item) {
    if (this.itemAddOnContent.item.itemId === undefined) {
      this.messageBox('Please select an item.');
      return;
    }

    if (this.itemAddOnContent.uom.uomId === undefined) {
      this.messageBox('Please select a UoM.');
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
          item: this.itemAddOnContent.item,
        },
        cssClass: 'custom-modal-styles',
      })
      .then((mdl) => {
        mdl.present();
        return mdl.onDidDismiss();
      })
      .then((mdl) => {
        if (mdl.role === 'itemUom') {
          this.itemAddOnContent.uom = mdl.data.uom;
        }
        this.modalOpen = false;
      });
  }

  onSaveAddOnContent() {
    if (this.itemAddOnContent.item.itemId === undefined) {
      this.messageBox('Some fields contain invalid information.');
      return;
    }

    if (this.itemAddOnContent.uom.uomId === undefined) {
      this.messageBox('Some fields contain invalid information.');
      return;
    }

    if (this.contentForm.valid) {
      this.itemAddOnContent.qty = this.contentForm.value.qty;
      this.itemAddOnContent.price = this.contentForm.value.price;
      this.itemAddOnContent.altDesc = this.contentForm.value.altDesc;

      this.modalController.dismiss(this.itemAddOnContent, 'saveContent');
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
