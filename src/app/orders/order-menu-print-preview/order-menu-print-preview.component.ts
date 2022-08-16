import { Component, OnDestroy, OnInit } from '@angular/core';
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
    public orderService: OrdersService,
  ) { }

  ngOnInit() {
    this.orderMenuSub = this.orderService.orderMenuPrintPreview.subscribe((data) => {
      this.orderMenuDto = data;
    });
  }

  ngOnDestroy(): void {
    this.orderMenuSub.unsubscribe();
  }
}
