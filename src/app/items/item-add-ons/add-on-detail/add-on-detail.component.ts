import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ItemAddOnDetail } from '../classes/item-add-on-detail.model';

@Component({
  selector: 'app-add-on-detail',
  templateUrl: './add-on-detail.component.html',
  styleUrls: ['./add-on-detail.component.scss'],
})
export class AddOnDetailComponent implements OnInit {

  itemAddOnDetail: ItemAddOnDetail;

  constructor(
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.itemAddOnDetail = new ItemAddOnDetail();
    this.itemAddOnDetail.itemAddOnDetailId = 0;
    this.itemAddOnDetail.description = '';
    this.itemAddOnDetail.isRequired = false;
    this.itemAddOnDetail.maxNoOfItems = 1;
    this.itemAddOnDetail.itemAddOnContents = [];
  }

  onSaveAddOn() {
    this.modalController.dismiss(this.itemAddOnDetail, 'saveAddOn');
  }

  dismissModal() {
    this.modalController.dismiss(null,'dismissModal');
  }

}
