import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { VendorWarehouseSearchComponent } from './vendor-warehouse-search.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  ],
  declarations: [VendorWarehouseSearchComponent],
})
export class VendorWarehouseSearchModule{}
