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
  item: Item;
  uom: Uom;

  contentForm: FormGroup;

  modalOpen = false;

  constructor(
    private modalController: ModalController,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    if (this.itemAddOnContent === undefined) {
      this.itemAddOnContent = new ItemAddOnContent();
      this.itemAddOnContent.itemAddOnContentId = 0;
      this.item = new Item();
      this.uom = new Uom();
    } else {
      this.item = this.itemAddOnContent.item;
      this.uom = this.itemAddOnContent.uom;
    }

    this.contentForm = new FormGroup({
      qty: new FormControl(this.itemAddOnContent.qty, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.min(0.0001)],
      }),
      price: new FormControl(this.itemAddOnContent.price, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.min(0)],
      }),
      altDesc: new FormControl(this.itemAddOnContent.altDesc),
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
          this.item = modal.data;
          this.uom = modal.data.uom;
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
          this.uom = mdl.data.uom;
        }
        this.modalOpen = false;
      });
  }

  onSaveAddOnContent() {
    if (this.item.itemId === undefined) {
      this.messageBox('Some fields contain invalid information.');
      return;
    }

    if (this.uom.uomId === undefined) {
      this.messageBox('Some fields contain invalid information.');
      return;
    }

    const tmpItm = new ItemAddOnContent();

    if (this.contentForm.valid) {
      tmpItm.itemAddOnContentId = this.itemAddOnContent.itemAddOnContentId;
      tmpItm.item = this.item;
      tmpItm.uom = this.uom;
      tmpItm.qty = this.contentForm.value.qty;
      tmpItm.price = this.contentForm.value.price;
      tmpItm.altDesc = this.contentForm.value.altDesc;

      this.modalController.dismiss(tmpItm, 'saveContent');
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
