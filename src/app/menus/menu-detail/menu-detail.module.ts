import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MenuDetailPageRoutingModule } from './menu-detail-routing.module';

import { MenuDetailPage } from './menu-detail.page';
import { ItemSearchComponent } from 'src/app/items/item-search/item-search.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MenuDetailPageRoutingModule
  ],
  declarations: [MenuDetailPage, ItemSearchComponent],
  entryComponents: [ItemSearchComponent]
})
export class MenuDetailPageModule {}
