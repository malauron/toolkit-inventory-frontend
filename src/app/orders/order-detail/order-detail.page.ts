/* eslint-disable no-underscore-dangle */
import { Component, OnInit } from '@angular/core';
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
    private navCtrl: NavController,
    private orderService: OrdersService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private modalCustomerSearch: ModalController
  ) {}

  ngOnInit() {
    this.isFetching = true;

    this.order.orderId = 1;

    this.orderService.getOrderMenus(this.order).subscribe((resData) => {
      this.orderMenus = this.orderMenus.concat(resData);
      console.log(this.orderMenus);
      this.isFetching = false;
    });
  }

  onCustomerSearch() {
    this.modalCustomerSearch
      .create({ component: CustomerSearchComponent })
      .then((modalSearch) => {
        modalSearch.present();
        return modalSearch.onDidDismiss();
      })
      .then((resultData) => {
        if (resultData.role === 'customer') {
          this.customer = resultData.data;
        }
      });
  }

  onSaveMenu(){
    if (this.customer.customerId !== undefined && this.orderMenus.length>0){

      const orderDto = new OrderDto(
        this.customer,
        this.processOrderMenus(this.orderMenus),
        this.processOrderMenu(this.orderMenus)
      );

      this.orderService.postOrders(orderDto).subscribe(
        res => { this.navCtrl.navigateBack('/tabs/orders'); },
        err => { console.log(err); }
      );
    } else {
      if (this.orderMenus.length <= 0) {
        this.messageBox('Cart is empty.');
      } else {
        this.messageBox('Please assign a customer for the order.');
      }
    }
  }

  processOrderMenus(menus: OrderMenu[]) {
    let orderMenus = new Array<OrderMenu>();
    orderMenus = [];
    for (const key in menus) {
      if (menus.hasOwnProperty(key)) {

        const menu = new Menu(
          menus[key].menu.menuId,
          menus[key].menu.menuName
        );

        const orderMenu = new OrderMenu(
          undefined,
          undefined,
          menu,
          menus[key].orderQty,
          menus[key].price,
          menus[key].lineTotal,
          this.processOrderMenuIngredients(menus[key].orderMenuIngredients)
        );
        orderMenus = orderMenus.concat(orderMenu);
      }
    }
    return orderMenus;
  }

  processOrderMenu(menus: OrderMenu[]) {
    let orderMenus = new Array<OrderMenu>();
    orderMenus = [];
    for (const key in menus) {
      if (menus.hasOwnProperty(key)) {
        const orderMenu = new OrderMenu(
          menus[key].orderMenuId
        );
        orderMenus = orderMenus.concat(orderMenu);
      }
    }
    return orderMenus;
  }

  processOrderMenuIngredients(ings: OrderMenuIngredient[]) {
    let orderMenuIngredients = new Array<OrderMenuIngredient>();
    orderMenuIngredients = [];
    for (const key in ings) {
      if (ings.hasOwnProperty(key)) {

        const item = new Item(
          ings[key].item.itemId,
          ings[key].item.itemName
        );

        const baseUom = new Uom(
          ings[key].baseUom.uomId,
          ings[key].baseUom.uomCode,
          ings[key].baseUom.uomName
        );

        const requiredUom = new Uom(
          ings[key].requiredUom.uomId,
          ings[key].requiredUom.uomCode,
          ings[key].requiredUom.uomName
        );

        const orderMenuIng = new OrderMenuIngredient(
          undefined,
          undefined,
          item,
          baseUom,
          ings[key].baseQty,
          requiredUom,
          ings[key].requiredQty,
          ings[key].orderedQty,
          ings[key].menuIngredientId
        );
        orderMenuIngredients = orderMenuIngredients.concat(orderMenuIng);
      }
    }
    return orderMenuIngredients;
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
