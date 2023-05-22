import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { ItemSearchComponent } from 'src/app/items/item-search/item-search.component';
import { Warehouse } from 'src/app/classes/warehouse.model';
import { WarehouseSearchComponent } from 'src/app/warehouses/warehouse-search/warehouse-search.component';
import { Item } from 'src/app/classes/item.model';
import { PosItemPrice } from '../classes/pos-item-price.model';
import { CustomerGroupsService } from 'src/app/services/customer-groups.service';
import { TempPosItemPriceLevel } from '../classes/temp-pos-item-price-level.model';

@Component({
  selector: 'app-item-prices',
  templateUrl: './item-prices.page.html',
  styleUrls: ['./item-prices.page.scss'],
})
export class ItemPricesPage implements OnInit {
  @ViewChild('infiniteScroll') infiniteScroll;

  warehouse: Warehouse;
  posItemPrice: PosItemPrice;
  item: Item;

  tempPosItemPriceLevels: TempPosItemPriceLevel[] = [];

  pageNumber = 0;
  totalPages = 0;

  isFetching = false;
  modalOpen = false;

  constructor(
    private modalSearch: ModalController,
    private toastController: ToastController,
    private customerGroupService: CustomerGroupsService,
  ) {}

  ngOnInit() {
    this.warehouse = new Warehouse();
    this.posItemPrice = new PosItemPrice();
    this.item = new Item();
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
            // this.isFetching = true;
            this.warehouse = resultData.data;
            this.posItemPrice.warehouse = this.warehouse;

            this.infiniteScroll.disabled = false;

            if (this.item.itemId > 0 && this.warehouse.warehouseId > 0) {
              this.getPosItemPrice(this.warehouse, this.item);
            }

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

  onItemSearch() {
    if (!this.modalOpen) {
      this.modalOpen = true;
      this.modalSearch
        .create({ component: ItemSearchComponent })
        .then((modalSearch) => {
          modalSearch.present();
          return modalSearch.onDidDismiss();
        })
        .then((resultData) => {
          if (resultData.role === 'item') {
            this.item = resultData.data;
            if (this.item.itemId > 0 && this.warehouse.warehouseId > 0) {
              this.getPosItemPrice(this.warehouse, this.item);
            }

            // const itemData = new Item();
            // const uomData = new Uom();

            // itemData.itemId = resultData.data.itemId;
            // itemData.itemName = resultData.data.itemName;
            // itemData.uom = resultData.data.uom;

            // uomData.uomId = resultData.data.uom.uomId;
            // uomData.uomName = resultData.data.uom.uomName;
            // uomData.uomCode = resultData.data.uom.uomCode;

            // this.item = resultData.data;
            // this.uoms = [];
            // this.uoms = this.uoms.concat(uomData);
            // this.getItemUoms(itemData.itemId);
            // this.itemForm.patchValue({
            //   item: itemData,
            //   itemName: itemData.itemName,
            //   uom: uomData,
            //   quantity: 1.0,
            //   price: 1.0,
            // });

            // const qtyElem = this.quantityInput.getInputElement();
            // qtyElem.then((res) => res.focus());
          }
          this.modalOpen = false;
        });
    }
  }

  getPosItemPrice(whse: Warehouse, itm: Item) {
    this.tempPosItemPriceLevels = [];

    this.customerGroupService
    .getCustomerGroups()
    .subscribe(data => {
      const globalPrice = new TempPosItemPriceLevel();
      globalPrice.lineNo = 1;
      globalPrice.description = 'Global Price';
      globalPrice.price = itm.price;
      this.tempPosItemPriceLevels = this.tempPosItemPriceLevels
                                        .concat(globalPrice);

      const defaultPrice = new TempPosItemPriceLevel();
      defaultPrice.lineNo = 2;
      defaultPrice.description = 'Default Warehouse Price';
      defaultPrice.price = 0;
      this.tempPosItemPriceLevels = this.tempPosItemPriceLevels
                                        .concat(defaultPrice);

      let ctr = 3;

      data.forEach((r) => {
        const tempPriceLvl = new TempPosItemPriceLevel();
        tempPriceLvl.lineNo = ctr;
        tempPriceLvl.description = r.customerGroupName;
        tempPriceLvl.customerGroup = r;
        tempPriceLvl.price = 0;
        this.tempPosItemPriceLevels = this.tempPosItemPriceLevels
                                          .concat(tempPriceLvl);
        ctr += 1;
      });

      console.log(this.tempPosItemPriceLevels);
      console.log(data);
    });
  }

  onPrintView() {}

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
