import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { OrderMenuIngredientSummaryDto } from 'src/app/classes/order-menu-ingredient-summary-dto.model';
import { PurchasesService } from 'src/app/services/purchases.service';

@Component({
  selector: 'app-purchase-list-print-preview',
  templateUrl: './purchase-list-print-preview.component.html',
  styleUrls: ['./purchase-list-print-preview.component.scss'],
})
export class PurchaseListPrintPreviewComponent implements OnInit, OnDestroy {

  orderIdsSub: Subscription;
  totalIngredients: OrderMenuIngredientSummaryDto[] = [];

  constructor(
    private purchaseService: PurchasesService,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.orderIdsSub = this.purchaseService.purchasePrintPreview
      .subscribe(this.getPurchaseList());
  }

  getPurchaseList() {
    return (res) => {
      this.purchaseService.getPurchaseList(res.orderId)
        .subscribe(data => {
          this.totalIngredients = this.totalIngredients.concat(data);
        });
    };
  }

  dismissModal() {
    this.modalController.dismiss(null, 'dismissModal');
  }

  ngOnDestroy(): void {
    this.orderIdsSub.unsubscribe();
  }

}
