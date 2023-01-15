import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SalesItemPageRoutingModule } from './sales-item-routing.module';

import { SalesItemPage } from './sales-item.page';
import { SaleItemService } from './sale-item.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    SalesItemPageRoutingModule
  ],
  declarations: [SalesItemPage],
  providers: [SaleItemService]
})
export class SalesItemPageModule {}
