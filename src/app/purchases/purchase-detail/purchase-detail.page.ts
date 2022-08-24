import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { PurchaseDto } from 'src/app/classes/purchase-dto.model';
import { PurchaseItem } from 'src/app/classes/purchase-item.model';
import { Purchase } from 'src/app/classes/purchase.model';
import { Vendor } from 'src/app/classes/vendor.model';
import { PurchasesService } from 'src/app/services/purchases.service';
import { VendorSearchComponent } from 'src/app/vendors/vendor-search/vendor-search.component';
import { PurchasedItemComponent } from '../purchased-item/purchased-item.component';

@Component({
  selector: 'app-purchase-detail',
  templateUrl: './purchase-detail.page.html',
  styleUrls: ['./purchase-detail.page.scss'],
})
export class PurchaseDetailPage implements OnInit, OnDestroy {

  purchase = new Purchase();
  vendor = new Vendor();
  purchaseItems: PurchaseItem[] = [];

  isFetching = false;
  modalOpen = false;

  totalAmt = 0;

  constructor(
    private purchaseService: PurchasesService,
    private modalCustomerSearch: ModalController,
    private toastCtrl: ToastController
    ) {}

  ngOnInit() {}

  onCustomerSearch() {
    if (!this.modalOpen) {
      this.modalOpen = true;
      this.modalCustomerSearch
        .create({ component: VendorSearchComponent })
        .then((modalSearch) => {
          modalSearch.present();
          return modalSearch.onDidDismiss();
        })
        .then((resultData) => {
          if (resultData.role === 'vendor') {
            this.vendor = resultData.data;
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
            this.totalAmt = 0;
            this.purchaseItems.forEach(item => {
              this.totalAmt += (item.cost * item.requiredQty);
            });
          }
          this.modalOpen = false;
        });
    }
  }

  onSavePurchaseDetails() {
    if (this.vendor.vendorId === undefined) {
      this.messageBox('Please provide a vendor');
      return;
    }
    if (this.purchaseItems.length <=0) {
      this.messageBox('Please provide at least 1 purchased item.');
      return;
    }

    console.log(this.purchaseItems);

    const purchaseDto = new PurchaseDto(
      this.totalAmt, this.vendor, this.purchaseItems
    );
    console.log(purchaseDto);
    this.purchaseService.postPurhcase(purchaseDto).subscribe(
      res => console.log(res)
    );
  }

  messageBox(msg: string) {
    this.toastCtrl
      .create({
        color: 'dark',
        duration: 2000,
        position: 'top',
        message: msg,
      })
      .then((res) => {
        res.present();
      });
  }

  ngOnDestroy(): void {}
}
