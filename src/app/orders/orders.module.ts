import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OrdersPageRoutingModule } from './orders-routing.module';

import { OrdersPage } from './orders.page';
import { OrderMenuPrintPreviewComponent } from './order-menu-print-preview/order-menu-print-preview.component';
import { NgxPrintModule } from 'ngx-print';
import { PurchaseListPrintPreviewComponent } from './purchase-list-print-preview/purchase-list-print-preview.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OrdersPageRoutingModule,
    NgxPrintModule,
  ],
  declarations: [
    OrdersPage,
    OrderMenuPrintPreviewComponent,
    PurchaseListPrintPreviewComponent,
  ],
  entryComponents: [
    OrderMenuPrintPreviewComponent,
    PurchaseListPrintPreviewComponent,
  ],
})
export class OrdersPageModule {}
