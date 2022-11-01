import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InventoriesPageRoutingModule } from './inventories-routing.module';

import { InventoriesPage } from './inventories.page';
import { NgxPrintModule } from 'ngx-print';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InventoriesPageRoutingModule,
    NgxPrintModule,
  ],
  declarations: [InventoriesPage]
})
export class InventoriesPageModule {}
