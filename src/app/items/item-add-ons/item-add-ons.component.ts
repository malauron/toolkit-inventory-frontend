import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AddOnDetailComponent } from './add-on-detail/add-on-detail.component';

@Component({
  selector: 'app-item-add-ons',
  templateUrl: './item-add-ons.component.html',
  styleUrls: ['./item-add-ons.component.scss'],
})
export class ItemAddOnsComponent implements OnInit {

  isButtonVisible = false;

  constructor(private modalAddOns: ModalController) { }

  ngOnInit() {}

  onShowAddOnDetail(){
    this.modalAddOns
        .create({
          component: AddOnDetailComponent,
          cssClass: 'my-modal'
        })
        .then(modal => {
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
