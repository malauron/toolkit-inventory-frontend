import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SalesItemPageRoutingModule } from './sales-item-routing.module';

import { SalesItemPage } from './sales-item.page';
import { SaleItemService } from './sale-item.service';
import { ItemSearchModule } from 'src/app/items/item-search/item-search.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    SalesItemPageRoutingModule,
    ItemSearchModule
  ],
  declarations: [SalesItemPage],
  providers: [SaleItemService]
})
export class SalesItemPageModule {}
