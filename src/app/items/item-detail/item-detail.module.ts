import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ItemDetailPageRoutingModule } from './item-detail-routing.module';

import { ItemDetailPage } from './item-detail.page';
import { ItemSearchModule } from '../item-search/item-search.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    ItemDetailPageRoutingModule,
    ItemSearchModule
  ],
  declarations: [ItemDetailPage]
})
export class ItemDetailPageModule {}
