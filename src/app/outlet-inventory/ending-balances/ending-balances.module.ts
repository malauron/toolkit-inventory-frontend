import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EndingBalancesPageRoutingModule } from './ending-balances-routing.module';

import { EndingBalancesPage } from './ending-balances.page';
import { NgxPrintModule } from 'ngx-print';
import { WarehouseSearchModule } from 'src/app/warehouses/warehouse-search/warehouse-search.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EndingBalancesPageRoutingModule,
    NgxPrintModule,
    // WarehouseSearchModule
  ],
  declarations: [EndingBalancesPage]
})
export class EndingBalancesPageModule {}
