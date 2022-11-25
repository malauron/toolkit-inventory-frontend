import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Warehouse } from 'src/app/classes/warehouse.model';
import { WarehousesService } from 'src/app/services/warehouses.service';
import { InventoryItem } from '../../classes/inventory-item.model';
import { InventoryItemsService } from '../../services/inventory-items.service';

@Component({
  selector: 'app-inventory-print-view',
  templateUrl: './inventory-print-view.page.html',
  styleUrls: ['./inventory-print-view.page.scss'],
})
export class InventoryPrintViewPage implements OnInit {

  warehouse = new Warehouse();

  inventoryItems: InventoryItem[] = [];

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private inventoryItemsService: InventoryItemsService,
    private warehouseService: WarehousesService,
  ) { }

  ngOnInit() {

    this.route.paramMap.subscribe(paramMap => {

      console.log(paramMap);
      if (isNaN(Number(paramMap.get('warehouseId')))) {
        this.navCtrl.navigateBack('/tabs/ending-balances');
        return;
      }

      const warehouseId = +paramMap.get('warehouseId');

      this.warehouseService.getWarehouseById(warehouseId).subscribe(res => {
        this.warehouse = res;
      });

      this.inventoryItemsService.getAllByWarehouseWithQty(warehouseId).subscribe(res => {
        this.inventoryItems = this.inventoryItems.concat(res);
      });

    });

  }

}
