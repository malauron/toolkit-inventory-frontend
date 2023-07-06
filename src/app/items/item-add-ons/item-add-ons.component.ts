import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AddOnDetailComponent } from './add-on-detail/add-on-detail.component';
import { AddOnContentComponent } from './add-on-content/add-on-content.component';
import { AddOnsServices } from './services/add-ons.service';
import { ItemAddOnDetail } from './classes/item-add-on-detail.model';
import { ItemsService } from 'src/app/services/items.service';
import { ItemAddOnContent } from './classes/item-add-on-content.model';

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

  onEditAddOnDetail(detail: ItemAddOnDetail) {
    const itm = new ItemAddOnDetail();
    itm.itemAddOnDetailId = detail.itemAddOnDetailId;
    itm.description = detail.description;
    itm.isRequired = detail.isRequired;
    itm.maxNoOfItems = detail.maxNoOfItems;

    this.mdl
      .create({
        component: AddOnDetailComponent,
        componentProps: {
          itemAddOnDetail: itm,
        },
        cssClass: 'custom-modal-styles',
      })
      .then((modal) => {
        modal.present();
        return modal.onDidDismiss();
      })
      .then((modal) => {
        if (modal.role === 'saveAddOn') {
          if (this.addOnsService.getItem().itemId > 0) {
            modal.data.item = this.addOnsService.getItem();
            this.addOnsService
              .postItemAddOnDetails(modal.data)
              .subscribe((res) => {
                detail.description = res.description;
                detail.isRequired = res.isRequired;
                detail.maxNoOfItems = res.maxNoOfItems;
              });
          } else {
            detail.description = modal.data.description;
            detail.isRequired = modal.data.isRequired;
            detail.maxNoOfItems = modal.data.maxNoOfItems;
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

  onEditAddOnContent(content: ItemAddOnContent, addOnDetail: ItemAddOnDetail) {
    this.mdl
      .create({
        component: AddOnContentComponent,
        componentProps: {
          itemAddOnContent: content,
        },
        cssClass: 'custom-modal-styles',
      })
      .then((modal) => {
        modal.present();
        return modal.onDidDismiss();
      })
      .then((modal) => {
        if (modal.role === 'saveContent') {
          if (modal.data.itemAddOnContentId > 0) {
            modal.data.itemAddOnDetail = addOnDetail;
            this.addOnsService
              .postItemAddOnContents(modal.data)
              .subscribe((res) => {
                content.item = res.item;
                content.uom = res.uom;
                content.price = res.price;
                content.qty = res.qty;
                content.altDesc = res.altDesc;
              });
          } else {
            content.item = modal.data.item;
            content.uom = modal.data.uom;
            content.price = modal.data.price;
            content.qty = modal.data.qty;
            content.altDesc = modal.data.altDesc;

          }
        }
        console.log(modal);
      });
  }
}
