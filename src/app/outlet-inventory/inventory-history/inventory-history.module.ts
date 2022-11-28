import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InventoryHistoryPageRoutingModule } from './inventory-history-routing.module';

import { InventoryHistoryPage } from './inventory-history.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InventoryHistoryPageRoutingModule
  ],
  declarations: [InventoryHistoryPage]
})
export class InventoryHistoryPageModule {}
