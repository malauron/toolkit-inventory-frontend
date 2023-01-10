import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SalesItemPageRoutingModule } from './sales-item-routing.module';

import { SalesItemPage } from './sales-item.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SalesItemPageRoutingModule
  ],
  declarations: [SalesItemPage]
})
export class SalesItemPageModule {}
