/* eslint-disable no-underscore-dangle */
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonFab, IonSearchbar, ModalController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { Order } from 'src/app/classes/order.model';
import { PurchasePrintPreviewDto } from 'src/app/classes/purchase-print-preview.dto';
import { AppParamsConfig } from 'src/app/Configurations/app-params.config';
import { OrdersService } from 'src/app/services/orders.service';
import { PurchasesService } from 'src/app/services/purchases.service';
import { PurchaseListPrintPreviewComponent } from '../purchase-list-print-preview/purchase-list-print-preview.component';

@Component({
  selector: 'app-orders-list',
  templateUrl: './orders-list.page.html',
  styleUrls: ['./orders-list.page.scss'],
})
export class OrdersListPage implements OnInit, OnDestroy {
  @ViewChild('infiniteScroll') infiniteScroll;
  @ViewChild('orderSearchBar', { static: true }) orderSearchBar: IonSearchbar;
  @ViewChild('purchaseListFab') purchaseListFab: IonFab;

  orderSearchBarSub: Subscription;
  orderSub: Subscription;

  orders: Order[] = [];

  purchasePrintPreview = new PurchasePrintPreviewDto([]);

  searchValue = '';

  pageNumber = 0;
  totalPages = 0;

  isFetching  = false;

  constructor(
    private orderService: OrdersService,
    private purchasesService: PurchasesService,
    private config: AppParamsConfig,
    private router: Router,
    private toastController: ToastController,
    private modalPrintPreview: ModalController
  ) { }

  ngOnInit() {

    this.orderSearchBarSub = this.orderSearchBar.ionInput
    .pipe(
      map((event) => (event.target as HTMLInputElement).value),
      debounceTime(this.config.waitTime),
      distinctUntilChanged()
    )
    .subscribe((res) => {
      this.searchValue = res.trim();
      this.infiniteScroll.disabled = false;
      this.orders = [];
      this.pageNumber = 0;
      this.totalPages = 0;
      if (this.searchValue) {
        this.getOrders(undefined, 0, this.config.pageSize, this.searchValue);
      } else {
        this.getOrders(undefined, 0, this.config.pageSize);
      }
    });

    // Retrieves a new set of data from the server
    // after adding or updating
    this.orderSub = this.orderService.ordersHaveChanged.subscribe((data) => {
      this.searchValue = '';
      this.infiniteScroll.disabled = false;
      this.orders = [];
      this.pageNumber = 0;
      this.totalPages = 0;
      this.getOrders(undefined, 0, this.config.pageSize);
    });


    // Retrieves a partial list from the server
    // upon component initialization
    this.getOrders(undefined, 0, this.config.pageSize);
  }

  getStatusColor(orderStatus): string {
    let statusColor: string;
    if (orderStatus === 'Preparing') {
      statusColor = 'warning';
    }if (orderStatus === 'Packed') {
      statusColor = 'secondary';
    }
    if (orderStatus === 'In Transit') {
      statusColor = 'tertiary';
    }
    if (orderStatus === 'Delivered') {
      statusColor = 'success';
    }
    if (orderStatus === 'Cancelled') {
      statusColor = 'primary';
    }
    return statusColor;
  }

  getOrders(event?, pageNumber?: number, pageSize?: number, searchDesc?: string) {
    this.isFetching = true;

    if (searchDesc === undefined) {
      this.orderService
        .getOrders(pageNumber, pageSize)
        .subscribe(this.processOrderResult(event), (error) => {
          this.messageBox('Unable to communicate with the server.');
        });
    } else {
      this.orderService
        .getOrders(pageNumber, pageSize, searchDesc)
        .subscribe(this.processOrderResult(event), (error) => {
          this.messageBox('Unable to communicate with the server.');
        });
    }
  }

  processOrderResult(event?) {
    return (data) => {
      this.orders = this.orders.concat(data._embedded.orders);
      this.totalPages = data.page.totalPages;
      this.isFetching = false;
      if (event) {
        event.target.complete();
      }
      this.infiniteScroll.disabled = false;
    };
  }

  onEditOrder(orderId: number) {
    this.router.navigate(['/', 'tabs', 'orders', 'order-detail', orderId]);
  }

  loadMoreOrders(event) {
    if (this.pageNumber + 1 >= this.totalPages) {
      event.target.disabled = true;
      return;
    }

    this.pageNumber++;

    if (this.searchValue) {
      this.getOrders(
        event,
        this.pageNumber,
        this.config.pageSize,
        this.searchValue
      );
    } else {
      this.getOrders(event, this.pageNumber, this.config.pageSize);
    }
  }

  onAddToPurchaseList(orderId: number) {
    if (!this.purchasePrintPreview.orderId.includes(orderId)){
      this.purchasePrintPreview.orderId.push(orderId);
    }
  }

  onPrintPurchaseList() {
    this.purchasesService.purchasePrintPreview
      .next(this.purchasePrintPreview);

    this.modalPrintPreview
      .create({ component: PurchaseListPrintPreviewComponent })
      .then((modalView) => {
        modalView.present();
        return modalView.onDidDismiss();
      });
  }

  onClearPurchaseList() {
    this.purchaseListFab.close();
    this.purchasePrintPreview.orderId = [];
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

  ngOnDestroy(): void {
    this.orderSearchBarSub.unsubscribe();
    this.orderSub.unsubscribe();
  }
}
