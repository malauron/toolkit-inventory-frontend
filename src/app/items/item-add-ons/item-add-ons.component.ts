import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AddOnDetailComponent } from './add-on-detail/add-on-detail.component';
import { AddOnContentComponent } from './add-on-content/add-on-content.component';
import { AddOnsServices } from './services/add-ons.service';
import { ItemAddOnDetail } from './classes/item-add-on-detail.model';
import { ItemAddOnContent } from './classes/item-add-on-content.model';

@Component({
  selector: 'app-item-add-ons',
  templateUrl: './item-add-ons.component.html',
  styleUrls: ['./item-add-ons.component.scss'],
})
export class ItemAddOnsComponent implements OnInit, OnDestroy {
  addOns: ItemAddOnDetail[];

  constructor(
    private mdl: ModalController,
    private addOnsService: AddOnsServices
  ) {}

  ngOnDestroy(): void {
    this.addOnsService.setItemAddOnDetails([]);
  }

  ngOnInit() {
    this.addOns = this.addOnsService.getItemAddOnDetails();
  }

  onShowAddOnDetail() {
    this.mdl
      .create({
        component: AddOnDetailComponent,
        cssClass: 'custom-modal-styles',
      })
      .then((modal) => {
        modal.present();
        return modal.onDidDismiss();
      })
      .then((modal) => {
        if (modal.role === 'saveAddOn') {
          this.addOns = this.addOns.concat(modal.data);
          this.addOnsService.setItemAddOnDetails(this.addOns);
        }
      });
  }

  onShowAddOnContent(addOnDetail: ItemAddOnDetail) {
    this.mdl
      .create({
        component: AddOnContentComponent,
        cssClass: 'custom-modal-styles',
      })
      .then((modal) => {
        modal.present();
        return modal.onDidDismiss();
      })
      .then((modal) => {
        if (modal.role === 'saveContent') {
          addOnDetail.itemAddOnContents = addOnDetail.itemAddOnContents.concat(
            modal.data
          );
          console.log(addOnDetail);
        }
      });
  }
}
