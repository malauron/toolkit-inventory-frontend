import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { BrokerageSearchComponent } from "./brokerage-search.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  ],
  declarations: [
    BrokerageSearchComponent
  ]
})
export class BrokerageSearchModule{}
