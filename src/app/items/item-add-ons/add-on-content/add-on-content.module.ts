import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AddOnContentComponent } from './add-on-content.component';
// import { ItemSearchModule } from '../../item-search/item-search.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    // ItemSearchModule
  ],
  declarations: [AddOnContentComponent]
})
export class AddOnContentModule{}
