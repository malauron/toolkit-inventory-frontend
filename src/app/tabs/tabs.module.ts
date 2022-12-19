import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TabsPageRoutingModule } from './tabs-routing.module';

import { TabsPage } from './tabs.page';
import { WarehouseSearchModule } from '../warehouses/warehouse-search/warehouse-search.module';
import { CustomerSearchModule } from '../customers/customer-search/customer-search.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TabsPageRoutingModule,
    CustomerSearchModule,
    WarehouseSearchModule
  ],
  declarations: [TabsPage]
})
export class TabsPageModule {}
