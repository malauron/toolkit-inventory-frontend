import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ButcheryReleasingsService } from '../butchery/services/butchery-releasings.service';
import { Warehouse } from '../classes/warehouse.model';
import { User } from '../Security/classes/user.model';
import { AuthenticationService } from '../Security/services/authentication.service';
import { WarehousesService } from '../services/warehouses.service';

@Component({
  selector: 'app-options',
  templateUrl: './options.page.html',
  styleUrls: ['./options.page.scss'],
})
export class OptionsPage implements OnInit {

  warehouse: Warehouse;
  user: User;

  constructor(
    private router: Router,
    private releasingsService: ButcheryReleasingsService,
    private authenticationService: AuthenticationService,
    private warehouseService: WarehousesService
  ) { }

  ngOnInit() {
    this.warehouse = new Warehouse();
    this.user = this.authenticationService.getUserFromLocalCache();

    this.warehouseService
      .getWarehouseByUserId(this.user.userId)
      .subscribe( (resWarehouse) => {
        this.warehouse.warehouseId = resWarehouse.warehouseId;
        this.warehouse.warehouseName = resWarehouse.warehouseName;

        this.releasingsService
          .getReleasingSummary(this.warehouse.warehouseId)
          .subscribe((resReleasingSummary) => {
            console.log(resReleasingSummary);
          });
      });
  }

  onBatches() {
    this.router.navigate(['/','tabs','butchery-batches']);
  }

  onReceiving() {
    this.router.navigate(['/','tabs','receivings']);
  }

  onProduction() {
    this.router.navigate(['/','tabs','productions']);
  }

  onReleasing() {
    this.router.navigate(['/','tabs','releasings']);
  }

  onInventory() {
    this.router.navigate(['/','tabs','inventories']);
  }

  onEndingBalance() {
    this.router.navigate(['/', 'tabs', 'ending-balances']);
  }

  onInventoryHistory() {
    this.router.navigate(['/', 'tabs', 'inventory-history']);
  }

  onPOS() {
    this.router.navigate(['/', 'tabs', 'order-items']);
  }

  onItemPrices() {
    this.router.navigate(['/', 'tabs', 'item-prices']);
  }

  drawChart() {

    const dimensions = {
      width: 1000,
      height: 600,
      margins: 20,
      ctrWidth: 0,
      ctrHeight: 0
    };

    dimensions.ctrWidth = dimensions.width - dimensions.margins * 2;
    dimensions.ctrHeight = dimensions.height - dimensions.margins * 2;

    // Draw Image

  }

}
