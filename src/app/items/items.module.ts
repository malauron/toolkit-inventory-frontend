import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ItemsPageRoutingModule } from './items-routing.module';

import { ItemsPage } from './items.page';
import { AddOnsServices } from './item-add-ons/services/add-ons.service';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, ItemsPageRoutingModule],
  declarations: [ItemsPage],
  providers: [AddOnsServices],
})
export class ItemsPageModule {}
