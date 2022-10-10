import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductionsPageRoutingModule } from './productions-routing.module';

import { ProductionsPage } from './productions.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProductionsPageRoutingModule
  ],
  declarations: [ProductionsPage]
})
export class ProductionsPageModule {}
