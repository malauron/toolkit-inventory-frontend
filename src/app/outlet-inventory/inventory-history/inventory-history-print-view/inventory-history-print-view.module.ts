import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InventoryHistoryPrintViewPageRoutingModule } from './inventory-history-print-view-routing.module';

import { InventoryHistoryPrintViewPage } from './inventory-history-print-view.page';
import { NgxPrintModule } from 'ngx-print';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InventoryHistoryPrintViewPageRoutingModule,
    NgxPrintModule
  ],
  declarations: [InventoryHistoryPrintViewPage]
})
export class InventoryHistoryPrintViewPageModule {}
