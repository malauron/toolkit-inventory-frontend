import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CartPageRoutingModule } from './cart-routing.module';

import { CartPage } from './cart.page';
import { CustomerSearchModule } from 'src/app/customers/customer-search/customer-search.module';
import { WarehouseSearchModule } from 'src/app/warehouses/warehouse-search/warehouse-search.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CartPageRoutingModule,
    // CustomerSearchModule,
    // WarehouseSearchModule
  ],
  declarations: [CartPage]
})
export class CartPageModule {}
