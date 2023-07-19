import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VendorWarehousesPageRoutingModule } from './vendor-warehouses-routing.module';

import { VendorWarehousesPage } from './vendor-warehouses.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VendorWarehousesPageRoutingModule
  ],
  declarations: [VendorWarehousesPage]
})
export class VendorWarehousesPageModule {}
