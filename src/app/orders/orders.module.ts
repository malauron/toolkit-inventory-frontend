import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OrdersPageRoutingModule } from './orders-routing.module';

import { OrdersPage } from './orders.page';
import { CustomerSearchComponent } from '../customers/customer-search/customer-search.component';
import { OrderMenuPrintPreviewComponent } from './order-menu-print-preview/order-menu-print-preview.component';
import { NgxPrintModule } from 'ngx-print';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OrdersPageRoutingModule,
    NgxPrintModule
  ],
  declarations: [OrdersPage, CustomerSearchComponent, OrderMenuPrintPreviewComponent],
  entryComponents: [CustomerSearchComponent, OrderMenuPrintPreviewComponent]
})
export class OrdersPageModule {}
