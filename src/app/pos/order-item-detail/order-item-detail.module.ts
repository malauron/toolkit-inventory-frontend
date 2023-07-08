/* eslint-disable @typescript-eslint/quotes */
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { OrderItemDetailComponent } from "./order-item-detail.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ],
  declarations: [OrderItemDetailComponent]
})
export class OrderItemDetailModule{}
