import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AddOnDetailModule } from './add-on-detail/add-on-detail.module';
import { ItemAddOnsComponent } from './item-add-ons.component';
import { AddOnContentModule } from './add-on-content/add-on-content.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddOnDetailModule,
    AddOnContentModule
  ],
  exports: [ItemAddOnsComponent],
  declarations: [ItemAddOnsComponent]
})

export class ItemAddOnsModule{}
