import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EndingBalancesPageRoutingModule } from './ending-balances-routing.module';

import { EndingBalancesPage } from './ending-balances.page';
import { NgxPrintModule } from 'ngx-print';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EndingBalancesPageRoutingModule,
    NgxPrintModule,
  ],
  declarations: [EndingBalancesPage]
})
export class EndingBalancesPageModule {}
