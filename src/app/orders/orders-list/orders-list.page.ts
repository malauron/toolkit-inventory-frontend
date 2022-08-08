/* eslint-disable no-underscore-dangle */
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonSearchbar, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { Order } from 'src/app/classes/order.model';
import { ConfigParam } from 'src/app/ConfigParam';
import { OrdersService } from 'src/app/services/orders.service';

@Component({
  selector: 'app-orders-list',
  templateUrl: './orders-list.page.html',
  styleUrls: ['./orders-list.page.scss'],
})
export class OrdersListPage implements OnInit, OnDestroy {
  @ViewChild('infiniteScroll') infiniteScroll;
  @ViewChild('orderSearchBar', { static: true }) orderSearchBar: IonSearchbar;

  orderSearchBarSub: Subscription;
  // orderSub: Subscription;

  orders: Order[] = [];

  searchValue = '';

  pageNumber = 0;
  totalPages = 0;


  isFetching  = false;

  constructor(
    private orderService: OrdersService,
    private config: ConfigParam,
    private router: Router,
    private toastController: ToastController,
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

    // Retrieves a partial list of ordes from the server
    // upon component initialization
    this.getOrders(undefined, 0, this.config.pageSize);
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
    // this.orderSub.unsubscribe();
  }
}
