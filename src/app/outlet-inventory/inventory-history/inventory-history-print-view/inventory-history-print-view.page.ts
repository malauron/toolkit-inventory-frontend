import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Warehouse } from 'src/app/classes/warehouse.model';
import { WarehousesService } from 'src/app/services/warehouses.service';
import { InventoryItem } from '../../classes/inventory-item.model';
import { InventoryItemsService } from '../../services/inventory-items.service';

@Component({
  selector: 'app-inventory-history-print-view',
  templateUrl: './inventory-history-print-view.page.html',
  styleUrls: ['./inventory-history-print-view.page.scss'],
})
export class InventoryHistoryPrintViewPage implements OnInit {
  @ViewChild('printButton') printButton: ElementRef;

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

  printPage() {
    if (this.warehouse.warehouseId) {
      console.log('done');
      this.printButton.nativeElement.click();
    }
  }

}
