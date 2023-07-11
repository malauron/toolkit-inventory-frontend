/* eslint-disable no-underscore-dangle */
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ItemAddOnDetail } from 'src/app/items/item-add-ons/classes/item-add-on-detail.model';
import { AddOnsServices } from 'src/app/items/item-add-ons/services/add-ons.service';
import { ItemsService } from 'src/app/services/items.service';
import { PosItemPrice } from '../classes/pos-item-price.model';

@Component({
  selector: 'app-order-item-detail',
  templateUrl: './order-item-detail.component.html',
  styleUrls: ['./order-item-detail.component.scss'],
})
export class OrderItemDetailComponent implements OnInit {
  posItemPrice: PosItemPrice;
  itemAddOnDetails: ItemAddOnDetail[];

  constructor(
    private itemService: ItemsService,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.itemService
      .getItemAddOnDetails(this.posItemPrice.item.itemId)
      .subscribe((res) => {
        this.itemAddOnDetails = res._embedded.itemAddOnDetails;
      });
  }

  validateCheckBox(event, detail: ItemAddOnDetail) {
    if (event.target.checked) {
      if (detail.checkedItems === undefined) {
        detail.checkedItems = 0;
      }
      detail.checkedItems += 1;
      if (detail.checkedItems > detail.maxNoOfItems) {
        event.target.checked = false;
      }
    } else {
      detail.checkedItems -= 1;
    }
  }

  dismissModal() {
    this.modalController.dismiss(null, 'dismissModal');
  }
}
