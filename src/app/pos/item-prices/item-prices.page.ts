import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { ItemSearchComponent } from 'src/app/items/item-search/item-search.component';
import { Warehouse } from 'src/app/classes/warehouse.model';
import { WarehouseSearchComponent } from 'src/app/warehouses/warehouse-search/warehouse-search.component';
import { Item } from 'src/app/classes/item.model';
import { PosItemPrice } from '../classes/pos-item-price.model';
import { CustomerGroupsService } from 'src/app/services/customer-groups.service';
import { TempPosItemPriceLevel } from '../classes/temp-pos-item-price-level.model';
import { PosItemPriceService } from '../services/pos-item-price.service';
import { PosItemPriceDto } from '../classes/pos-item-price-dto.model';
import { PosItemPriceLevel } from '../classes/pos-item-price-level.model';

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
  isUploading = false;
  modalOpen = false;

  constructor(
    private modalSearch: ModalController,
    private toastController: ToastController,
    private customerGroupService: CustomerGroupsService,
    private posItemPriceService: PosItemPriceService
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
            this.warehouse = resultData.data;
            this.posItemPrice.warehouse = this.warehouse;
            if (this.item.itemId > 0 && this.warehouse.warehouseId > 0) {
              this.getPosItemPrice(this.warehouse, this.item);
            }
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
          }
          this.modalOpen = false;
        });
    }
  }

  getPosItemPrice(whse: Warehouse, itm: Item) {
    this.tempPosItemPriceLevels = [];

    this.customerGroupService.getCustomerGroups().subscribe((data) => {
      const globalPrice = new TempPosItemPriceLevel();
      globalPrice.lineNo = 1;
      globalPrice.description = 'Global';
      globalPrice.price = itm.price;
      this.tempPosItemPriceLevels =
        this.tempPosItemPriceLevels.concat(globalPrice);

      const defaultPrice = new TempPosItemPriceLevel();
      defaultPrice.lineNo = 2;
      defaultPrice.description = `Warehouse's Default`;
      defaultPrice.price = 0;
      this.tempPosItemPriceLevels =
        this.tempPosItemPriceLevels.concat(defaultPrice);

      let ctr = 3;

      data.forEach((r) => {
        const tempPriceLvl = new TempPosItemPriceLevel();
        tempPriceLvl.lineNo = ctr;
        tempPriceLvl.description = r.customerGroupName;
        tempPriceLvl.customerGroup = r;
        tempPriceLvl.price = 0;
        this.tempPosItemPriceLevels =
          this.tempPosItemPriceLevels.concat(tempPriceLvl);
        ctr += 1;
      });

      this.posItemPriceService
        .getPosItemPrice(whse.warehouseId, itm.itemId)
        .subscribe(
          (res) => {
            this.posItemPrice.defaultPrice = res.defaultPrice;
            res.posItemPriceLevels.forEach((pl) => {
              this.tempPosItemPriceLevels.forEach((tpl) => {
                if (tpl.lineNo > 2) {
                  if (
                    tpl.customerGroup.customerGroupId ===
                    pl.customerGroup.customerGroupId
                  ) {
                    tpl.posItemPriceLevelId = pl.posItemPriceLevelId;
                    tpl.price = pl.price;
                    return;
                  }
                } else {
                  if (tpl.lineNo === 2) {
                    tpl.price = res.defaultPrice;
                  }
                }
              });
            });
            this.isFetching = false;
          },
          (err) => {
            this.isFetching = false;
          }
        );
    });
  }

  onSave() {
    if (!this.isUploading) {
      this.isUploading = true;
      const posItemPriceDto = new PosItemPriceDto();
      let posItemPriceLevels: PosItemPriceLevel[] = [];

      posItemPriceDto.posItemPriceId = this.posItemPrice.posItemPriceId;
      posItemPriceDto.item = this.item;
      posItemPriceDto.warehouse = this.warehouse;

      this.tempPosItemPriceLevels.forEach((pl) => {
        if (pl.lineNo === 2) {
          posItemPriceDto.defaultPrice = pl.price;
        }

        if (pl.lineNo > 2) {
          const priceLevel = new PosItemPriceLevel();
          priceLevel.posItemPriceLevelId = pl.posItemPriceLevelId;
          priceLevel.customerGroup = pl.customerGroup;
          priceLevel.price = pl.price;
          posItemPriceLevels = posItemPriceLevels.concat(priceLevel);
        }
      });

      posItemPriceDto.posItemPriceLevels = posItemPriceLevels;

      console.log(posItemPriceDto);
    }
    this.isUploading = false;
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
