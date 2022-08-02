/* eslint-disable no-underscore-dangle */
import { Component, OnInit } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { CartMenuIngredient } from 'src/app/classes/cart-menu-ingredient.model';
import { CartMenu } from 'src/app/classes/cart-menu.model';
import { CartsService } from 'src/app/services/carts.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {
  cartMenus: CartMenu[] = [];

  constructor(
    private cartService: CartsService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.cartService.getCartMenus().subscribe((resData) => {
      this.cartMenus = resData._embedded.cartMenus;
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

  processCartMenuIngredients(ing: CartMenuIngredient[]) {
    let cartMenuIngredients = new Array<CartMenuIngredient>();
    cartMenuIngredients = [];
    for (const key in ing) {
      if (ing.hasOwnProperty(key)) {
        const cartMenuIng = new CartMenuIngredient(
          ing[key].cartMenuIngredientId,
          ing[key].cartMenu,
          ing[key].item,
          ing[key].baseUom,
          ing[key].baseQty,
          ing[key].requiredUom,
          ing[key].requiredQty,
          ing[key].orderedQty
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
              this.cartService.deleteCartMenu(menu).subscribe((res) => {
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
              this.cartService.deleteCartMenuIngredient(ing).subscribe((res) => {
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
