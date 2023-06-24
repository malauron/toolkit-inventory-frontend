import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AddOnDetailComponent } from './add-on-detail/add-on-detail.component';
import { AddOnContentComponent } from './add-on-content/add-on-content.component';

@Component({
  selector: 'app-item-add-ons',
  templateUrl: './item-add-ons.component.html',
  styleUrls: ['./item-add-ons.component.scss'],
})
export class ItemAddOnsComponent implements OnInit {
  isButtonVisible = false;

  constructor(private mdl: ModalController) {}

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
      });
  }

  onShowAddOnContent() {
    this.mdl
      .create({
        component: AddOnContentComponent,
        cssClass: 'custom-modal-styles',
      })
      .then((modal) => {
        modal.present();
        return modal.onDidDismiss();
      });
  }

  showButton() {
    this.isButtonVisible = true;
  }

  hideButton() {
    this.isButtonVisible = true;
  }
}
