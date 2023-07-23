/* eslint-disable no-underscore-dangle */
import { Component, OnInit } from '@angular/core';
import {
  AlertController,
  ModalController,
  NavController,
  ToastController,
} from '@ionic/angular';
import { CartMenuIngredient } from 'src/app/classes/cart-menu-ingredient.model';
import { CartMenu } from 'src/app/classes/cart-menu.model';
import { Customer } from 'src/app/classes/customer.model';
import { Item } from 'src/app/classes/item.model';
import { Menu } from 'src/app/classes/menu.model';
import { OrderDto } from 'src/app/classes/order-dto.model';
import { OrderMenuIngredient } from 'src/app/classes/order-menu-ingredient.models';
import { OrderMenu } from 'src/app/classes/order-menu.model';
import { Uom } from 'src/app/classes/uom.model';
import { Warehouse } from 'src/app/classes/warehouse.model';
import { CustomerSearchComponent } from 'src/app/customers/customer-search/customer-search.component';
import { CartsService } from 'src/app/services/carts.service';
import { OrdersService } from 'src/app/services/orders.service';
import { WarehouseSearchComponent } from 'src/app/warehouses/warehouse-search/warehouse-search.component';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {
  cartMenus: CartMenu[] = [];
  customer: Customer;
  warehouse: Warehouse;

  isFetching = false;
  modalOpen = false;

  constructor(
    private navCtrl: NavController,
    private cartService: CartsService,
    private orderService: OrdersService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private modalSearch: ModalController
  ) {}

  ngOnInit() {
    this.isFetching = true;
    this.customer = new Customer();
    this.warehouse = new Warehouse();
    this.cartService.getCartMenus().subscribe((resData) => {
      this.cartMenus = resData._embedded.cartMenus;
      this.isFetching = false;
    });
  }

  onCustomerSearch() {
    if (!this.modalOpen) {
      this.modalSearch
        .create({ component: CustomerSearchComponent })
        .then((modalSearch) => {
          modalSearch.present();
          return modalSearch.onDidDismiss();
        })
        .then((resultData) => {
          if (resultData.role === 'customer') {
            this.customer = resultData.data;
          }
          this.modalOpen = false;
        });
    }
  }

  onWarehouseSearch() {
    if (!this.modalOpen) {
      this.modalSearch
        .create({ component: WarehouseSearchComponent })
        .then((modalSearch) => {
          modalSearch.present();
          return modalSearch.onDidDismiss();
        })
        .then((resultData) => {
          if (resultData.role === 'warehouse') {
            this.warehouse = resultData.data;
          }
          this.modalOpen = false;
        });
    }
  }

  onSaveMenu() {
    if (
      this.customer.customerId &&
      this.warehouse.warehouseId &&
      this.cartMenus.length > 0
    ) {
      const orderDto = new OrderDto();
      orderDto.customer = this.customer;
      orderDto.warehouse = this.warehouse;
      orderDto.orderMenus = this.processOrderMenus(this.cartMenus);
      orderDto.cartMenus = this.processCartMenu(this.cartMenus);

      this.orderService.postOrders(orderDto).subscribe(
        (res) => {
          this.navCtrl.navigateBack('/tabs/orders');
        },
        (err) => {
        }
      );
    } else {
      if (this.cartMenus.length <= 0) {
        this.messageBox('Cart is empty.');
      } else if (!this.customer.customerId) {
        this.messageBox('Please assign a customer for the order.');
      } else {
        this.messageBox('Please choose a warehouse.');
      }
    }
  }

  processOrderMenus(menus: CartMenu[]) {
    let orderMenus = new Array<OrderMenu>();
    orderMenus = [];
    for (const key in menus) {
      if (menus.hasOwnProperty(key)) {
        const menu = new Menu(menus[key].menu.menuId, menus[key].menu.menuName);

        const orderMenu = new OrderMenu(
          undefined,
          undefined,
          menu,
          menus[key].orderQty,
          menus[key].price,
          menus[key].lineTotal,
          this.processOrderMenuIngredients(menus[key].cartMenuIngredients)
        );
        orderMenus = orderMenus.concat(orderMenu);
      }
    }
    return orderMenus;
  }

  processCartMenu(menus: CartMenu[]) {
    let cartMenus = new Array<CartMenu>();
    cartMenus = [];
    for (const key in menus) {
      if (menus.hasOwnProperty(key)) {
        const cartMenu = new CartMenu(menus[key].cartMenuId);
        cartMenus = cartMenus.concat(cartMenu);
      }
    }
    return cartMenus;
  }

  processOrderMenuIngredients(ings: CartMenuIngredient[]) {
    let orderMenuIngredients = new Array<OrderMenuIngredient>();
    orderMenuIngredients = [];
    for (const key in ings) {
      if (ings.hasOwnProperty(key)) {
        const item = new Item(ings[key].item.itemId, ings[key].item.itemName);

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

        const cartMenuIng = new OrderMenuIngredient();

        cartMenuIng.item = item;
        cartMenuIng.baseUom = baseUom;
        cartMenuIng.baseQty = ings[key].baseQty;
        cartMenuIng.requiredUom = requiredUom;
        cartMenuIng.requiredQty = ings[key].requiredQty;
        cartMenuIng.orderedQty = ings[key].orderedQty;
        cartMenuIng.menuIngredientId = ings[key].menuIngredientId;

        orderMenuIngredients = orderMenuIngredients.concat(cartMenuIng);
      }
    }
    return orderMenuIngredients;
  }

  onDeleteMenu(menu: CartMenu) {
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
              const cartMenu = new CartMenu(menu.cartMenuId);

              this.cartService.deleteCartMenu(cartMenu).subscribe((res) => {
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

  removeMenuObj(menu: CartMenu) {
    for (const key in this.cartMenus) {
      if (menu === this.cartMenus[key]) {
        this.cartMenus.splice(Number(key), 1);
      }
    }
  }

  onDeleteIngredient(ing: CartMenuIngredient, ings: CartMenuIngredient[]) {
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
              const cartMenuIngredient = new CartMenuIngredient(
                ing.cartMenuIngredientId
              );

              this.cartService
                .deleteCartMenuIngredient(cartMenuIngredient)
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

  removeIngredientObj(ing: CartMenuIngredient, ings: CartMenuIngredient[]) {
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
