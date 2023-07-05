import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AddOnDetailComponent } from './add-on-detail/add-on-detail.component';
import { AddOnContentComponent } from './add-on-content/add-on-content.component';
import { AddOnsServices } from './services/add-ons.service';
import { ItemAddOnDetail } from './classes/item-add-on-detail.model';
import { ItemsService } from 'src/app/services/items.service';

@Component({
  selector: 'app-item-add-ons',
  templateUrl: './item-add-ons.component.html',
  styleUrls: ['./item-add-ons.component.scss'],
})
export class ItemAddOnsComponent implements OnInit, OnDestroy {
  constructor(
    private mdl: ModalController,
    public addOnsService: AddOnsServices
  ) {}

  ngOnDestroy(): void {
    this.addOnsService.setItemAddOnDetails([]);
  }

  ngOnInit() {}

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
          if (this.addOnsService.getItem().itemId > 0) {
            // const itemAddOnDetail = new ItemAddOnDetail();
            // itemAddOnDetail.item = this.addOnsService.getItem();
            // itemAddOnDetail.description = modal.data.description;
            // itemAddOnDetail.isRequired = modal.data.isRequired;
            // itemAddOnDetail.maxNoOfItems = modal.data.maxNoOfItems;
            modal.data.item = this.addOnsService.getItem();
            this.addOnsService
              .postItemAddOnDetails(modal.data)
              .subscribe((res) => {
                this.addOnsService.addItemDetail(res);
              });
          } else {
            this.addOnsService.addItemDetail(modal.data);
          }
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
          if (addOnDetail.itemAddOnDetailId > 0) {
            modal.data.itemAddOnDetail = new ItemAddOnDetail(
              addOnDetail.itemAddOnDetailId
            );
            this.addOnsService
              .postItemAddOnContents(modal.data)
              .subscribe((res) => {
                addOnDetail.itemAddOnContents =
                  addOnDetail.itemAddOnContents.concat(res);
              });
          } else {
            addOnDetail.itemAddOnContents =
              addOnDetail.itemAddOnContents.concat(modal.data);
          }
        }
      });
  }
}
