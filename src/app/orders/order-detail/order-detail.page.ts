/* eslint-disable no-underscore-dangle */
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  AlertController,
  IonPopover,
  ModalController,
  NavController,
  ToastController,
} from '@ionic/angular';
import { Customer } from 'src/app/classes/customer.model';
import { OrderDto } from 'src/app/classes/order-dto.model';
import { OrderMenuDto } from 'src/app/classes/order-menu-dto.model';
import { OrderMenuIngredient } from 'src/app/classes/order-menu-ingredient.models';
import { OrderMenuPrintPreviewDto } from 'src/app/classes/order-menu-print-preview.dto.model';
import { OrderMenu } from 'src/app/classes/order-menu.model';
import { Order } from 'src/app/classes/order.model';
import { OrderDetailsConfig } from 'src/app/Configurations/order-details.config';
import { OrdersService } from 'src/app/services/orders.service';
import { OrderMenuPrintPreviewComponent } from '../order-menu-print-preview/order-menu-print-preview.component';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.page.html',
  styleUrls: ['./order-detail.page.scss'],
})
export class OrderDetailPage implements OnInit {
  @ViewChild('orderStatusPopover') orderStatusPopover: IonPopover;
  orderStatusPopoverOpen = false;

  orderMenus: OrderMenuDto[] = [];
  customer = new Customer();
  order = new Order();
  orderDetailsConfig = new OrderDetailsConfig();
  // orderStatusButton: string;
  isFetching = false;

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private orderService: OrdersService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private modalPrintPreview: ModalController
  ) {}

  ngOnInit() {
    this.isFetching = true;
    // this.orderStatusButton = 'false';
    this.route.paramMap.subscribe((paramMap) => {
      if (!paramMap.has('orderId')) {
        this.navCtrl.navigateBack('/tabs/orders/orders-list');
        return;
      }

      if (isNaN(Number(paramMap.get('menuId')))) {
        this.navCtrl.navigateBack('/tabs/orders/orders-list');
        return;
      }

      const orderId = Number(paramMap.get('orderId'));

      this.orderService.getOrder(orderId).subscribe((resData) => {
        this.order = resData;
        this.customer = resData.customer;
        this.orderDetailsConfig.setParams(this.order.orderStatus);
      });

      this.orderService.getOrderMenus(orderId).subscribe((resData) => {
        this.orderMenus = this.orderMenus.concat(resData);
        this.isFetching = false;
      });
    });
  }

  onUpdateStatus(newStatus: string) {
    const orderDto = new OrderDto();
    orderDto.orderId = this.order.orderId;
    orderDto.orderStatus = newStatus;
    this.orderService.putOrderSetStatus(orderDto).subscribe((res) => {
      const oldStatus = res.orderStatus;

      console.log(oldStatus);
      console.log(newStatus);

      if (oldStatus === 'Preparing') {
        this.messageBox('Order has been successfully tagged as ' + newStatus);
        this.orderDetailsConfig.setParams(newStatus);
        this.order.orderStatus = newStatus;
      } else if (oldStatus === 'Packed') {
        const status = ['In Transit', 'Delivered', 'Cancelled'];
        if (status.includes(newStatus)) {
          this.messageBox('Order has been successfully tagged as ' + newStatus);
          this.orderDetailsConfig.setParams(newStatus);
          this.order.orderStatus = newStatus;
        } else {
          this.messageBox(
            'Unable to update the order since it has been already tagged as ' +
              oldStatus
          );
          this.orderDetailsConfig.setParams(oldStatus);
          this.order.orderStatus = oldStatus;
        }
      } else if (oldStatus === 'In Transit') {
        const status = ['Delivered', 'Cancelled'];
        if (status.includes(newStatus)) {
          this.messageBox('Order has been successfully tagged as ' + newStatus);
          this.orderDetailsConfig.setParams(newStatus);
          this.order.orderStatus = newStatus;
        } else {
          this.messageBox(
            'Unable to update the order since it has been already tagged as ' +
              oldStatus
          );
          this.orderDetailsConfig.setParams(oldStatus);
          this.order.orderStatus = oldStatus;
        }
      } else {
        this.messageBox(
          'Unable to update the order since it has been already tagged as ' +
            oldStatus
        );
        this.orderDetailsConfig.setParams(oldStatus);
        this.order.orderStatus = oldStatus;
      }
    });
  }

  onDeleteMenu(menu: OrderMenu) {
    if (this.orderDetailsConfig.deleteIngredientButton) {
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
                this.orderService
                  .deleteOrderMenu(menu.orderMenuId)
                  .subscribe((res) => {
                    this.removeMenuObj(menu);
                  });
              },
            },
          ],
        })
        .then((res) => {
          res.present();
        });
    }
  }

  removeMenuObj(menu: OrderMenu) {
    for (const key in this.orderMenus) {
      if (menu === this.orderMenus[key]) {
        this.orderMenus.splice(Number(key), 1);
      }
    }
  }

  onDeleteIngredient(ing: OrderMenuIngredient, ings: OrderMenuIngredient[]) {
    if (this.orderDetailsConfig.deleteIngredientButton) {
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
                this.orderService
                  .deleteOrderMenuIngredient(ing.orderMenuIngredientId)
                  .subscribe((res) => {
                    this.removeIngredientObj(ing, ings);
                  });
              },
            },
          ],
        })
        .then((res) => {
          res.present();
        });
    }
  }

  removeIngredientObj(ing: OrderMenuIngredient, ings: OrderMenuIngredient[]) {
    for (const key in ings) {
      if (ing === ings[key]) {
        ing.orderMenuIngredientId = 0;
      }
    }
  }

  onPrintPreview(menu: OrderMenuDto) {
    const orderMenuPrintPreviewDto = new OrderMenuPrintPreviewDto();
    orderMenuPrintPreviewDto.orderId = this.order.orderId;
    orderMenuPrintPreviewDto.dateCreated = this.order.dateCreated;
    orderMenuPrintPreviewDto.customerName = this.customer.customerName;
    orderMenuPrintPreviewDto.contactNo = this.customer.contactNo;
    orderMenuPrintPreviewDto.address = this.customer.address;
    orderMenuPrintPreviewDto.orderMenu = menu;
    this.orderService.orderMenuPrintPreview.next(orderMenuPrintPreviewDto);

    this.modalPrintPreview
      .create({ component: OrderMenuPrintPreviewComponent })
      .then((modalView) => {
        modalView.present();
        return modalView.onDidDismiss();
      })
      .then((resultData) => {
        if (resultData.role === 'customer') {
          // this.customer = resultData.data;
        }
      });
  }

  onShowPopOver(event: Event) {
    this.orderStatusPopover.event = event;
    this.orderStatusPopoverOpen = true;
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
}
