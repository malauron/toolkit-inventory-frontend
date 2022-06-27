import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CartMenuPageRoutingModule } from './cart-menu-routing.module';

import { CartMenuPage } from './cart-menu.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CartMenuPageRoutingModule
  ],
  declarations: [CartMenuPage]
})
export class CartMenuPageModule {}
