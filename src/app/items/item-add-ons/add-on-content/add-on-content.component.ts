import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ItemSearchComponent } from '../../item-search/item-search.component';

@Component({
  selector: 'app-add-on-content',
  templateUrl: './add-on-content.component.html',
  styleUrls: ['./add-on-content.component.scss'],
})
export class AddOnContentComponent implements OnInit {

  constructor(
    private modalController: ModalController,
    private modalItemSearch: ModalController
  ) { }

  ngOnInit() {}

  onItemSearch(item?: string) {
    this.modalController.create({
      component: ItemSearchComponent,
      cssClass: 'custom-modal-styles'
    }).then(mdl => {
      mdl.present();
      return mdl.onDidDismiss();
    });
  }

  dismissModal() {
    this.modalController.dismiss(null,'dismissModal');
  }

}
