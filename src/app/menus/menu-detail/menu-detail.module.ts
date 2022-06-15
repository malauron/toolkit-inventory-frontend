import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MenuDetailPageRoutingModule } from './menu-detail-routing.module';

import { MenuDetailPage } from './menu-detail.page';
import { ItemSearchComponent } from 'src/app/items/item-search/item-search.component';
import { SwiperModule  } from 'swiper/angular';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MenuDetailPageRoutingModule,
    SwiperModule
  ],
  declarations: [MenuDetailPage, ItemSearchComponent],
  entryComponents: [ItemSearchComponent]
})
export class MenuDetailPageModule {}
