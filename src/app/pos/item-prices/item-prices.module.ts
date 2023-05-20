import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ItemPricesPageRoutingModule } from './item-prices-routing.module';

import { ItemPricesPage } from './item-prices.page';
import { ItemSearchModule } from 'src/app/items/item-search/item-search.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ItemPricesPageRoutingModule,
    ItemSearchModule
  ],
  declarations: [ItemPricesPage]
})
export class ItemPricesPageModule {}
