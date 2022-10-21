import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ItemSearchModule } from 'src/app/items/item-search/item-search.module';
import { ReceivedItemService } from './received-item.service';
import { ReceivedItemComponent } from './received-item.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    ItemSearchModule
  ],
  declarations: [ReceivedItemComponent],
  providers: [ReceivedItemService]
})
export class ReceivedItemModule{}
