import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ReceivingItemSearchComponent } from './receiving-item-search.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  ],
  declarations: [ReceivingItemSearchComponent]
})
export class ReceivingItemSearchModule{}
