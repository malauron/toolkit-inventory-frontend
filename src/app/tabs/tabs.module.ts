import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TabsPageRoutingModule } from './tabs-routing.module';

import { TabsPage } from './tabs.page';
import { WarehouseSearchModule } from '../warehouses/warehouse-search/warehouse-search.module';
import { CustomerSearchModule } from '../customers/customer-search/customer-search.module';
import { ClientSearchModule } from '../project-management/project-clients/client-search/client-search.module';
import { BrokerSearchModule } from '../project-management/project-brokers/broker-search/broker-search.module';
import { BrokerageSearchModule } from '../project-management/project-brokerages/brokerage-search/brokerage-search.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TabsPageRoutingModule,
    CustomerSearchModule,
    WarehouseSearchModule,
    ClientSearchModule,
    BrokerSearchModule,
    BrokerageSearchModule,
  ],
  declarations: [TabsPage]
})
export class TabsPageModule {}
