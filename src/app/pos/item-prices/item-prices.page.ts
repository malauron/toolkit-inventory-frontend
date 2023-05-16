import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { Warehouse } from 'src/app/classes/warehouse.model';
import { WarehouseSearchComponent } from 'src/app/warehouses/warehouse-search/warehouse-search.component';

@Component({
  selector: 'app-item-prices',
  templateUrl: './item-prices.page.html',
  styleUrls: ['./item-prices.page.scss'],
})
export class ItemPricesPage implements OnInit {

  @ViewChild('infiniteScroll') infiniteScroll;

  warehouse: Warehouse;

  pageNumber = 0;
  totalPages = 0;

  isFetching = false;
  modalOpen = false;

  constructor(private modalSearch: ModalController, private toastController: ToastController) { }

  ngOnInit() {
    this.warehouse = new Warehouse();
  }

  onWarehouseSearch() {
    if (this.isFetching) {
      return;
    }

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
            this.isFetching = true;
            this.warehouse = resultData.data;

            this.infiniteScroll.disabled = false;
            // this.inventoryItems = [];
            // this.pageNumber = 0;
            // this.totalPages = 0;
            // this.getInventoryItemsByPage(
            //   undefined,
            //   this.searchValue,
            //   this.warehouse.warehouseId,
            //   this.pageNumber,
            //   this.config.pageSize
            // );
          }
          this.modalOpen = false;
        });
    }
  }

  onPrintView() {

  }

  loadMoreData(event) {
    if (this.pageNumber + 1 >= this.totalPages) {
      event.target.disabled = true;
      return;
    }

    this.pageNumber++;

    // this.getInventoryItemsByPage(
    //   event,
    //   this.searchValue,
    //   this.warehouse.warehouseId,
    //   this.pageNumber,
    //   this.config.pageSize
    // );
  }

  async messageBox(messageDescription: string) {
    const toast = await this.toastController.create({
      color: 'dark',
      duration: 2000,
      position: 'top',
      message: messageDescription,
    });
    await toast.present();
  }

}
