import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ItemCost } from 'src/app/classes/item-cost.model';
import { Warehouse } from 'src/app/classes/warehouse.model';
import { ItemsService } from 'src/app/services/items.service';
import { WarehouseSearchComponent } from 'src/app/warehouses/warehouse-search/warehouse-search.component';

@Component({
  selector: 'app-inventories',
  templateUrl: './inventories.page.html',
  styleUrls: ['./inventories.page.scss'],
})
export class InventoriesPage implements OnInit {

  warehouse: Warehouse;
  itemCosts: ItemCost[] = [];

  modalOpen = false;

  constructor(
    private modalSearch: ModalController,
    private itemsService: ItemsService,
  ) { }

  ngOnInit() {
    this.warehouse = new Warehouse();
  }

  onWarehouseSearch() {
    if (!this.modalOpen) {
      this.modalOpen = true;
      this.modalSearch
        .create({ component: WarehouseSearchComponent })
        .then((modalSearch) => {
          modalSearch.present();
          return modalSearch.onDidDismiss();
        })
        .then((resultData) => {
          if (resultData.role === 'warehouse') {
              this.warehouse = resultData.data;
              this.itemsService.getItemCosts(this.warehouse.warehouseId)
              .subscribe(res => {
                this.itemCosts =  [];
                this.itemCosts = this.itemCosts.concat(res);
                console.log(this.itemCosts);
              });
          }
          this.modalOpen = false;
        });
    }
  }


  printPage() {
    window.print();
  }

}
