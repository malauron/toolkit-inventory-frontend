/* eslint-disable no-underscore-dangle */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, ModalController, NavController, ToastController } from '@ionic/angular';
import { Customer } from 'src/app/classes/customer.model';
import { Item } from 'src/app/classes/item.model';
import { Menu } from 'src/app/classes/menu.model';
import { OrderDto } from 'src/app/classes/order-dto.model';
import { OrderMenuDto } from 'src/app/classes/order-menu-dto.model';
import { OrderMenuIngredient } from 'src/app/classes/order-menu-ingredient.models';
import { OrderMenu } from 'src/app/classes/order-menu.model';
import { Order } from 'src/app/classes/order.model';
import { Uom } from 'src/app/classes/uom.model';
import { CustomerSearchComponent } from 'src/app/customers/customer-search/customer-search.component';
import { OrdersService } from 'src/app/services/orders.service';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.page.html',
  styleUrls: ['./order-detail.page.scss'],
})

export class OrderDetailPage implements OnInit {

  orderMenus: OrderMenuDto[] = [];
  customer = new Customer();
  order = new Order();

  isFetching = false;

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private orderService: OrdersService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
  ) {}

  ngOnInit() {
    this.isFetching = true;

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
        this.customer = resData.customer;
      });

      this.orderService.getOrderMenus(orderId).subscribe((resData) => {
        this.orderMenus = this.orderMenus.concat(resData);
        this.isFetching = false;
      });

    });
  }

  onDeleteMenu(menu: OrderMenu) {
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

              const orderMenu = new OrderMenu(
                menu.orderMenuId
              );

              // this.orderService.deleteOrderMenu(OrderMenu).subscribe((res) => {
              //   this.removeMenuObj(menu);
              // });
            },
          },
        ],
      })
      .then((res) => {
        res.present();
      });
  }

  removeMenuObj(menu: OrderMenu) {
    for (const key in this.orderMenus) {
      if (menu === this.orderMenus[key]) {
        this.orderMenus.splice(Number(key), 1);
      }
    }
  }

  onDeleteIngredient(ing: OrderMenuIngredient, ings: OrderMenuIngredient[]) {
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

              const orderMenuIngredient = new OrderMenuIngredient(ing.orderMenuIngredientId);

              // this.orderService.deleteOrderMenuIngredient(OrderMenuIngredient).subscribe((res) => {
              //   this.removeIngredientObj(ing, ings);
              // });
            },
          },
        ],
      })
      .then((res) => {
        res.present();
      });
  }

  removeIngredientObj(ing: OrderMenuIngredient, ings: OrderMenuIngredient[]) {
    for (const key in ings) {
      if (ing === ings[key]) {
        ings.splice(Number(key), 1);
      }
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

}
