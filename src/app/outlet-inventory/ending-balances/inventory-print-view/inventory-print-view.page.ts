import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { InventoryItem } from '../../classes/inventory-item.model';
import { InventoryItemsService } from '../../services/inventory-items.service';

@Component({
  selector: 'app-inventory-print-view',
  templateUrl: './inventory-print-view.page.html',
  styleUrls: ['./inventory-print-view.page.scss'],
})
export class InventoryPrintViewPage implements OnInit {

  inventoryItems: InventoryItem[] = [];

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private inventoryItemsService: InventoryItemsService,
  ) { }

  ngOnInit() {

    this.route.paramMap.subscribe(paramMap => {

      console.log(paramMap);
      if (isNaN(Number(paramMap.get('warehouseId')))) {
        this.navCtrl.navigateBack('/tabs/ending-balances');
        return;
      }

      const warehouseId = +paramMap.get('warehouseId');

      this.inventoryItemsService.getAllByWarehouseWithQty(warehouseId).subscribe(res => {
        this.inventoryItems = this.inventoryItems.concat(res);
        console.log(res);
      });

    });

  }

}
