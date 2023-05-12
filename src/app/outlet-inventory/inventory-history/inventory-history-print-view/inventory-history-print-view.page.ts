import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { InventoryHistoryItem } from '../../classes/inventory-history-item.model';
import { InventoryHistoriesService } from '../../services/inventory-histories.service';

@Component({
  selector: 'app-inventory-history-print-view',
  templateUrl: './inventory-history-print-view.page.html',
  styleUrls: ['./inventory-history-print-view.page.scss'],
})
export class InventoryHistoryPrintViewPage implements OnInit {
  @ViewChild('printButton') printButton: ElementRef;

  inventoryHistoryItems: InventoryHistoryItem[] = [];

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private inventoryHistoriesService: InventoryHistoriesService,
  ) { }

  ngOnInit() {

    this.route.paramMap.subscribe(paramMap => {

      if (isNaN(Number(paramMap.get('inventoryHistoryId')))) {
        this.navCtrl.navigateBack('/tabs/inventory-history');
        return;
      }

      const inventoryHistoryId = +paramMap.get('inventoryHistoryId');


      this.inventoryHistoriesService.getInventoryHistoryItems(inventoryHistoryId).subscribe(res => {
        this.inventoryHistoryItems = this.inventoryHistoryItems.concat(res);
      });

    });

  }

  printPage() {
    this.printButton.nativeElement.click();
  }

}
