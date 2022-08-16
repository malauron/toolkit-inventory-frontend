import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { OrderMenuPrintPreviewDto } from 'src/app/classes/order-menu-print-preview.dto.model';
import { OrdersService } from 'src/app/services/orders.service';

@Component({
  selector: 'app-order-menu-print-preview',
  templateUrl: './order-menu-print-preview.component.html',
  styleUrls: ['./order-menu-print-preview.component.scss'],
})
export class OrderMenuPrintPreviewComponent implements OnInit, OnDestroy {

  orderMenuSub: Subscription;
  orderMenuDto = new OrderMenuPrintPreviewDto();

  constructor(
    private orderService: OrdersService,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.orderMenuSub = this.orderService.orderMenuPrintPreview.subscribe((data) => {
      this.orderMenuDto = data;
    });
  }

  dismissModal() {
    this.modalController.dismiss(null, 'dismissModal');
  }

  ngOnDestroy(): void {
    this.orderMenuSub.unsubscribe();
  }
}
