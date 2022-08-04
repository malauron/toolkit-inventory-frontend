/* eslint-disable no-underscore-dangle */
import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { CartMenuIngredient } from 'src/app/classes/cart-menu-ingredient.model';
import { CartMenu } from 'src/app/classes/cart-menu.model';
import { Customer } from 'src/app/classes/customer.model';
import { Menu } from 'src/app/classes/menu.model';
import { CustomerSearchComponent } from 'src/app/customers/customer-search/customer-search.component';
import { CartsService } from 'src/app/services/carts.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {
  cartMenus: CartMenu[] = [];
  customer = new Customer();

  isFetching = false;

  constructor(
    private cartService: CartsService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private modalCustomerSearch: ModalController
  ) {}

  ngOnInit() {
    this.isFetching = true;
    this.cartService.getCartMenus().subscribe((resData) => {
      this.cartMenus = resData._embedded.cartMenus;
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

  processCartMenuResult() {
    return (data) => {
      for (const key in data._embedded.cartMenus) {
        if (data._embedded.cartMenus.hasOwnProperty(key)) {
          const cartMenu = new CartMenu();
        }
      }
    };
  }

  processCartMenuIngredients(ings: CartMenuIngredient[]) {
    let cartMenuIngredients = new Array<CartMenuIngredient>();
    cartMenuIngredients = [];
    for (const key in ings) {
      if (ings.hasOwnProperty(key)) {
        const cartMenuIng = new CartMenuIngredient(
          ings[key].cartMenuIngredientId,
          ings[key].cartMenu,
          ings[key].item,
          ings[key].baseUom,
          ings[key].baseQty,
          ings[key].requiredUom,
          ings[key].requiredQty,
          ings[key].orderedQty
        );
        cartMenuIngredients = cartMenuIngredients.concat(cartMenuIng);
      }
    }
    return cartMenuIngredients;
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

              const cartMenu = new CartMenu(
                menu.cartMenuId
              );

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

              const cartMenuIngredient = new CartMenuIngredient(ing.cartMenuIngredientId);

              this.cartService.deleteCartMenuIngredient(cartMenuIngredient).subscribe((res) => {
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
