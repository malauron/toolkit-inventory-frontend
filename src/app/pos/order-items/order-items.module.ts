import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OrderItemsPageRoutingModule } from './order-items-routing.module';

import { OrderItemsPage } from './order-items.page';
import { OrderItemDetailModule } from '../order-item-detail/order-item-detail.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OrderItemDetailModule,
    OrderItemsPageRoutingModule
  ],
  declarations: [OrderItemsPage]
})
export class OrderItemsPageModule {}
