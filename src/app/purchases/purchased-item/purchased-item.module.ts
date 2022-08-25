import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ItemSearchModule } from 'src/app/items/item-search/item-search.module';
import { PurchaseItemService } from './purchase-item.service';
import { PurchasedItemComponent } from './purchased-item.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    ItemSearchModule
  ],
  declarations: [PurchasedItemComponent],
  providers: [PurchaseItemService]
})
export class PurchasedItemModule{}
