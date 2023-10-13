import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ItemSearchModule } from 'src/app/items/item-search/item-search.module';
import { ProductionSourceService } from './production-source.service';
import { ProductionSourceComponent } from './production-source.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule
  ],
  declarations: [ProductionSourceComponent],
  providers: [ProductionSourceService]
})
export class ProductionSourceModule{}
