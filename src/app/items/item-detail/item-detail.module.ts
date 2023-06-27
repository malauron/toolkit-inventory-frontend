import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ItemDetailPageRoutingModule } from './item-detail-routing.module';

import { ItemDetailPage } from './item-detail.page';
import { ItemSearchModule } from '../item-search/item-search.module';
import { UomSearchModule } from '../../uoms/uom-search/uom-search.module';
import { ItemAddOnsModule } from '../item-add-ons/item-add-ons.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    ItemDetailPageRoutingModule,
    ItemSearchModule,
    UomSearchModule,
    ItemAddOnsModule
  ],
  declarations: [ItemDetailPage]
})
export class ItemDetailPageModule {}
