import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
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

  constructor(private modalController: ModalController) {}

  ngOnInit() {
    this.itemAddOnContent = new ItemAddOnContent();
    this.itemAddOnContent.itemAddOnId = 0;
    this.itemAddOnContent.item = new Item();
    this.itemAddOnContent.uom = new Uom();
    this.itemAddOnContent.qty = 1;
    this.itemAddOnContent.price = 0;
    this.itemAddOnContent.altDesc = '';
  }

  onItemSearch(item?: string) {
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
      });
  }

  onUomSearch(item?: Item) {
    this.modalController
      .create({
        component: UomSearchComponent,
        componentProps: {
          item: this.itemAddOnContent.item
        },
        cssClass: 'custom-modal-styles',
      })
      .then((mdl) => {
        mdl.present();
        return mdl.onDidDismiss();
      })
      .then((mdl) => {
        this.itemAddOnContent.uom = mdl.data.uom;
      });
  }

  onSaveAddOnContent() {
    this.modalController.dismiss(this.itemAddOnContent, 'saveContent');
  }

  dismissModal() {
    this.modalController.dismiss(null, 'dismissModal');
  }
}
