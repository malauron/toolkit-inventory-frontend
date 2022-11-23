import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InventoryPrintViewPageRoutingModule } from './inventory-print-view-routing.module';

import { InventoryPrintViewPage } from './inventory-print-view.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InventoryPrintViewPageRoutingModule
  ],
  declarations: [InventoryPrintViewPage]
})
export class InventoryPrintViewPageModule {}
