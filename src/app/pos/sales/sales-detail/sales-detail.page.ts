import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, IonPopover, IonSearchbar, ModalController, NavController, ToastController } from '@ionic/angular';
import { Customer } from 'src/app/classes/customer.model';
import { ItemDto } from 'src/app/classes/item-dto.model';
import { Warehouse } from 'src/app/classes/warehouse.model';
import { CustomerSearchComponent } from 'src/app/customers/customer-search/customer-search.component';
import { ItemsService } from 'src/app/services/items.service';
import { WarehouseSearchComponent } from 'src/app/warehouses/warehouse-search/warehouse-search.component';
import { PosSaleDto } from '../../classes/pos-sale-dto.model';
import { PosSaleItemPrint } from '../../classes/pos-sale-item-print';
import { PosSaleItem } from '../../classes/pos-sale-item.model';
import { PosSale } from '../../classes/pos-sale.model';
import { SaleDetailsConfig } from '../../config/sale-details.config';
import { PosSalesService } from '../../services/pos-sales.service';
import { SaleItemDetail } from '../sales-item/sale-item.model';
import { SaleItemService } from '../sales-item/sale-item.service';
import { SalesItemPage } from '../sales-item/sales-item.page';

@Component({
  selector: 'app-sales-detail',
  templateUrl: './sales-detail.page.html',
  styleUrls: ['./sales-detail.page.scss'],
})
export class SalesDetailPage implements OnInit, OnDestroy {
  @ViewChild('statusPopover') statusPopover: IonPopover;
  @ViewChild('itemSearchBar') itemSearchBar: IonSearchbar;

  statusPopoverOpen = false;

  saleId = '00000000';

  sale: PosSale;
  warehouse: Warehouse;
  customer: Customer;
  saleItems: PosSaleItem[] = [];
  receiptSaleItems: PosSaleItemPrint[] = [];
  saleDetailsConfig: SaleDetailsConfig;

  isUploading = false;
  dataHaveChanged = false;
  isFetching = false;
  modalOpen = false;

  totalAmount = 0;

  constructor(
    private itemsService: ItemsService,
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private salesService: PosSalesService,
    private saleItemService: SaleItemService,
    private modalSearch: ModalController,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.isFetching = true;

    this.sale = new PosSale();

    this.warehouse = new Warehouse();

    this.saleDetailsConfig = new SaleDetailsConfig();

    this.route.paramMap.subscribe((paramMap) => {
      if (!paramMap.has('posSaleId')) {
        this.navCtrl.navigateBack('/tabs/sales');
        return;
      }

      if (isNaN(Number(paramMap.get('posSaleId')))) {
        this.navCtrl.navigateBack('/tabs/sales');
        return;
      }

      const posSaleId = Number(paramMap.get('posSaleId'));
      if (posSaleId > 0) {
        this.salesService.getSale(posSaleId).subscribe(
          (resData) => {
            if (!resData.posSaleId) {
              this.navCtrl.navigateBack('/tabs/sales');
              return;
            }

            this.customer = new Customer();
            this.saleId = resData.posSaleId.toString();
            this.sale.posSaleId = resData.posSaleId;
            this.sale.totalAmount = resData.totalAmount;
            this.sale.saleStatus = resData.saleStatus;
            this.saleDetailsConfig.setParams(resData.saleStatus);
            this.sale.dateCreated = resData.dateCreated;
            this.warehouse = resData.warehouse;
            this.customer = resData.customer;
            this.saleItems = resData.posSaleItems;
            this.totalAmount = this.sale.totalAmount;
            this.isFetching = false;
          },
          (err) => {
            this.navCtrl.navigateBack('/tabs/sales');
            return;
          }
        );
      } else {
        this.isFetching = false;
      }
    });
  }

  onGetItemByItemCode(event) {
    if (event && event.key === 'Enter') {
      const fullBarcode = this.itemSearchBar.value;

      this.itemsService.getItemByItemCode(fullBarcode).subscribe((res) => {
        if (res.item) {
          this.addSaleItem(res, fullBarcode, 1);
        } else {
          this.messageBox('Item not found!');
        }
      });

      this.itemSearchBar.value = '';
    }
  }

  addSaleItem(itemDto: ItemDto, barcode = '', itemQty = 0) {
    const saleItem = new PosSaleItem();
    const cost = itemDto.item.price;
    const baseQty = 1;

    saleItem.item = itemDto.item;
    saleItem.barcode = barcode;
    saleItem.itemClass = itemDto.item.itemClass;
    saleItem.baseUom = itemDto.item.uom;
    saleItem.baseQty = baseQty;
    saleItem.cost = 0;
    saleItem.requiredUom = itemDto.item.uom;
    saleItem.releasedQty = itemQty;
    saleItem.itemPrice = cost;
    saleItem.totalAmount = baseQty * itemQty * cost;

    if (this.sale.posSaleId) {
      saleItem.posSale = this.sale;
      this.salesService
        .putSaleItem(saleItem)
        .subscribe((res) => {
          this.dataHaveChanged = true;
          this.sale.saleStatus = res.saleStatus;
          if (this.sale.saleStatus === 'Unposted') {
            this.saleItems.unshift(res.posSaleItem);
            this.getTotalAmt();
            this.messageBox('New sale item has been added.');
          } else {
            this.messageBox(
              'Unable to update the sale since its status has been tagged as ' +
                this.sale.saleStatus
            );
          }
        });
    } else {
      this.saleItems.unshift(saleItem);
      this.getTotalAmt();
    }
  }

  onAddSaleItem() {
    if (!this.modalOpen) {
      this.modalOpen = true;
      this.saleItemService.saleItemDetail.next(undefined);
      this.modalSearch
        .create({ component: SalesItemPage })
        .then((modalSearch) => {
          modalSearch.present();
          return modalSearch.onDidDismiss();
        })
        .then((resultData) => {
          if (resultData.role === 'item') {
            const item: SaleItemDetail = resultData.data;
            const saleItem = new PosSaleItem();

            saleItem.item = item.item;
            saleItem.requiredUom = item.uom;
            saleItem.purchasedQty = item.quantity;
            saleItem.purchasePrice = item.price;
            saleItem.totalAmount = item.quantity * item.price;

            if (this.sale.posSaleId) {
              saleItem.posSale = this.sale;
              this.purchaseService
                .putPurchaseItem(saleItem)
                .subscribe((res) => {
                  this.dataHaveChanged = true;
                  this.purchase.purchaseStatus = res.purchaseStatus;
                  if (this.purchase.purchaseStatus === 'Unposted') {
                    this.saleItems = this.saleItems.concat(
                      res.saleItem
                    );
                    this.getTotalAmt();
                    this.messageBox('New purchased item has been added.');
                  } else {
                    this.messageBox(
                      'Unable to update the purchase since its status has been tagged as ' +
                        this.purchase.purchaseStatus
                    );
                  }
                });
            } else {
              this.saleItems = this.saleItems.concat(saleItem);
              this.getTotalAmt();
            }
          }
          this.modalOpen = false;
        });
    }
  }

  onUpdateStatus(newStatus: string) {
    if (!this.isUploading) {
      this.isUploading = true;
      const saleDto = new PosSaleDto();

      saleDto.posSaleId = this.sale.posSaleId;
      saleDto.saleStatus = newStatus;

      this.salesService.putSaleSetStatus(saleDto).subscribe(
        (res) => {
          if (res.errorDescription) {
            this.messageBox(res.errorDescription);
            this.isUploading = false;
            return;
          }
          this.dataHaveChanged = true;
          if (res.saleStatus === 'Unposted') {
            this.saleId = String(res.posSaleId);
            this.sale.saleStatus = newStatus;
            this.saleDetailsConfig.setParams(newStatus);
            this.messageBox(
              `PosSale has been ${newStatus.toLowerCase()} successfully.`
            );
          } else {
            this.saleId = String(res.posSaleId);
            this.sale.saleStatus = res.saleStatus;
            this.saleDetailsConfig.setParams(res.saleStatus);
            this.messageBox(
              'Unable to update the sale since its status has been tagged as ' +
                this.sale.saleStatus
            );
          }
          this.isUploading = false;
        },
        (err) => {
          this.dataHaveChanged = true;
          this.messageBox(
            'An error occured while trying to update the sale detail.'
          );
          this.isUploading = false;
        }
      );
    }
  }

  onWarehouseSearch(destWhse?: boolean) {
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
            if (this.sale.posSaleId) {
              const saleDto = new PosSaleDto();
              saleDto.posSaleId =
                this.sale.posSaleId;

              saleDto.warehouse = resultData.data;

              this.dataHaveChanged = true;

              this.salesService
                .putSale(saleDto)
                .subscribe((res) => {
                  this.sale.saleStatus = res.saleStatus;
                  if (this.sale.saleStatus === 'Unposted') {
                    this.warehouse = resultData.data;
                    this.messageBox(
                      `Sold items will be taken from ${this.warehouse.warehouseName}.`
                    );
                  } else {
                    this.messageBox(
                      'Unable to update the information since its status has been tagged as ' +
                        this.sale.saleStatus
                    );
                  }
                });
            } else {
              this.warehouse = resultData.data;
            }
          }
          this.modalOpen = false;
        });
    }
  }

  onCustomerSearch() {
    if (!this.modalOpen) {
      this.modalOpen = true;
      this.modalSearch
        .create({ component: CustomerSearchComponent })
        .then((modalSearch) => {
          modalSearch.present();
          return modalSearch.onDidDismiss();
        })
        .then((resultData) => {
          if (resultData.role === 'customer') {
            if (this.sale.posSaleId) {
              const saleDto = new PosSaleDto();
              saleDto.posSaleId =
                this.sale.posSaleId;
              saleDto.customer = resultData.data;
              this.dataHaveChanged = true;

              this.salesService
                .putSale(saleDto)
                .subscribe((res) => {
                  this.sale.saleStatus = res.saleStatus;
                  if (this.sale.saleStatus === 'Unposted') {
                    this.customer = resultData.data;
                    this.messageBox(
                      `Produced items will be delivered to ${this.customer.customerName}.`
                    );
                  } else {
                    this.messageBox(
                      'Unable to update the sale since its status has been tagged as ' +
                        this.sale.saleStatus
                    );
                  }
                });
            } else {
              this.customer = resultData.data;
            }
          }
          this.modalOpen = false;
        });
    }
  }

  onSaveSale() {
    if (this.isUploading) {
      return;
    }

    if (!this.warehouse.warehouseId) {
      this.messageBox('Please choose a warehouse.');
      return;
    }

    if (!this.warehouse.warehouseId) {
      this.messageBox('Please choose a destination warehouse');
      return;
    }

    if (this.saleItems.length <= 0) {
      this.messageBox('Please add at least 1 sale item.');
      return;
    }

    this.isUploading = true;

    const saleDto = new PosSaleDto();

    saleDto.totalAmount = this.totalAmount;
    saleDto.warehouse = this.warehouse;
    saleDto.customer = this.customer;
    saleDto.posSaleItems = this.saleItems;

    this.salesService
      .postSale(saleDto)
      .subscribe(this.onProcessSavedSale());
  }

  onProcessSavedSale() {
    return (res: PosSale) => {
      this.saleId = String(res.posSaleId);
      this.sale.posSaleId = res.posSaleId;
      this.sale.saleStatus = res.saleStatus;
      this.sale.totalAmount = res.totalAmount;
      this.saleDetailsConfig.setParams(res.saleStatus);
      this.sale.dateCreated = res.dateCreated;
      this.saleItems = res.posSaleItems;
      this.dataHaveChanged = true;
      this.isUploading = false;
    };
  }

  updateSaleItemObj(
    pItem: PosSaleItem,
    saleItem: PosSaleItem
  ) {
    for (const key in this.saleItems) {
      if (pItem === this.saleItems[key]) {
        this.saleItems[key].item = saleItem.item;
        this.saleItems[key].requiredUom = saleItem.requiredUom;
        this.saleItems[key].releasedQty = saleItem.releasedQty;
        this.saleItems[key].itemPrice = saleItem.itemPrice;
        this.saleItems[key].totalAmount = saleItem.totalAmount;
      }
    }
  }

  onDeleteSaleItem(pItem: PosSaleItem) {
    this.alertCtrl
      .create({
        header: 'Confirm',
        message: 'This will be deleted permanently .',
        buttons: [
          {
            text: 'Cancel',
          },
          {
            text: 'Delete',
            handler: () => {
              if (pItem.posSaleItemId !== undefined) {
                pItem.posSale = this.sale;
                this.salesService
                  .deleteSaleItem(pItem)
                  .subscribe((res) => {
                    this.dataHaveChanged = true;
                    this.sale.saleStatus = res.saleStatus;
                    if (this.sale.saleStatus === 'Unposted') {
                      this.removeMenuObj(pItem);
                      this.messageBox(
                        'PosSale item has been deleted successfully.'
                      );
                    } else {
                      this.messageBox(
                        'Unable to delete the sale item since sale has been tagged as ' +
                          this.sale.saleStatus
                      );
                    }
                  });
              } else {
                this.removeMenuObj(pItem);
              }
            },
          },
        ],
      })
      .then((res) => {
        res.present();
      });
  }

  removeMenuObj(pItem: PosSaleItem) {
    for (const key in this.saleItems) {
      if (pItem === this.saleItems[key]) {
        this.saleItems.splice(Number(key), 1);
      }
    }
    this.getTotalAmt();
  }

  getTotalAmt() {
    this.totalAmount = 0;
    this.saleItems.forEach((itm) => {
      this.totalAmount += itm.totalAmount;
    });
  }

  onShowPopOver(event: Event) {
    this.statusPopover.event = event;
    this.statusPopoverOpen = true;
  }

  printPage() {
    if (this.sale.posSaleId !== undefined) {
      this.isFetching = true;
      const saleId = this.sale.posSaleId;

      this.receiptSaleItems = [];

      this.salesService.getSaleItems(saleId).subscribe((res) => {

        let prevUom = null;
        let prevItemId = 0;
        let runningItemQty = 0;
        let itemCtr = 0;
        let i = 1;

        res.forEach((item) => {
          const salItem = new PosSaleItemPrint();

          //Display subtotal
          if (
            (prevItemId !== 0 &&
            prevItemId !== item.item.itemId)
          ) {
            const subTtlQty = new PosSaleItemPrint();

            subTtlQty.isSubTotal = true;
            subTtlQty.totalUom = prevUom;
            subTtlQty.runningEntries = itemCtr;
            subTtlQty.runningItemQty = runningItemQty;
            this.receiptSaleItems =
              this.receiptSaleItems.concat(subTtlQty);

            runningItemQty = 0;
            itemCtr = 0;

          }

          salItem.posSaleItemId = item.posSaleItemId;
          salItem.item = item.item;
          salItem.barcode = item.barcode;
          salItem.itemClass = item.itemClass;
          salItem.baseUom = item.baseUom;
          salItem.baseQty = item.baseQty;
          salItem.cost = item.cost;
          salItem.requiredUom = item.requiredUom;
          salItem.releasedQty = item.releasedQty;
          salItem.itemPrice = item.itemPrice;
          salItem.totalAmount = item.totalAmount;
          salItem.isSubTotal = false;
          this.receiptSaleItems =
            this.receiptSaleItems.concat(salItem);

          prevUom = item.requiredUom;
          runningItemQty = runningItemQty + item.releasedQty;
          itemCtr++;

          //Display subtotal after the last item
          if (i === res.length) {
            const subTtlQty = new PosSaleItemPrint();
            subTtlQty.isSubTotal = true;
            subTtlQty.totalUom = prevUom;
            subTtlQty.runningEntries = itemCtr;
            subTtlQty.runningItemQty = runningItemQty;
            this.receiptSaleItems =
              this.receiptSaleItems.concat(subTtlQty);
          }


          i = i + 1;
          prevItemId = item.item.itemId;

        });

        setTimeout(() => {
          window.print();
          this.isFetching = false;
        }, 2000);
      });
    }
  }

  messageBox(msg: string) {
    this.toastCtrl
      .create({
        color: 'dark',
        duration: 2000,
        position: 'top',
        message: msg,
      })
      .then((res) => {
        res.present();
      });
  }

  ngOnDestroy(): void {
    if (this.dataHaveChanged) {
      this.salesService.salesHaveChanged.next(true);
    }
  }
}
