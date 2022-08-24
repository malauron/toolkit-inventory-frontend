import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Customer } from 'src/app/classes/customer.model';
import { PurchaseItem } from 'src/app/classes/purchase-item.model';
import { Purchase } from 'src/app/classes/purchase.model';
import { CustomerSearchComponent } from 'src/app/customers/customer-search/customer-search.component';
import { PurchasedItemComponent } from '../purchased-item/purchased-item.component';

@Component({
  selector: 'app-purchase-detail',
  templateUrl: './purchase-detail.page.html',
  styleUrls: ['./purchase-detail.page.scss'],
})
export class PurchaseDetailPage implements OnInit, OnDestroy {

  purchase = new Purchase();
  customer = new Customer();
  purchaseItems: PurchaseItem[] = [];

  isFetching = false;
  modalOpen = false;

  constructor(private modalCustomerSearch: ModalController) {}

  ngOnInit() {}

  onCustomerSearch() {
    if (!this.modalOpen) {
      this.modalOpen = true;
      this.modalCustomerSearch
        .create({ component: CustomerSearchComponent })
        .then((modalSearch) => {
          modalSearch.present();
          return modalSearch.onDidDismiss();
        })
        .then((resultData) => {
          if (resultData.role === 'customer') {
            this.customer = resultData.data;
          }
          this.modalOpen = false;
        });
    }
  }

  onAddPurchasedItem() {
    if (!this.modalOpen) {
      this.modalOpen = true;
      this.modalCustomerSearch
        .create({ component: PurchasedItemComponent })
        .then((modalSearch) => {
          modalSearch.present();
          return modalSearch.onDidDismiss();
        })
        .then((resultData) => {
          if (resultData.role === 'purchasedItem') {
            this.purchaseItems = this.purchaseItems.concat(resultData.data);
          }
          this.modalOpen = false;
        });
    }
  }

  ngOnDestroy(): void {}
}
