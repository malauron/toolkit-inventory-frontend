/* eslint-disable no-underscore-dangle */
import { Component, OnInit } from '@angular/core';
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
  ) { }

  ngOnInit() {

    this.cartService.getCartMenus()
    .subscribe(
      resData => {
        this.cartMenus = resData._embedded.cartMenus;
        console.log(this.cartMenus);
      }
    );
  }

  processCartMenuResult() {
    return (data) => {
      for (const key in data._embedded.cartMenus) {
        if (data._embedded.cartMenus.hasOwnProperty(key)) {
          const cartMenu = new CartMenu();
          console.log(
            this.processCartMenuIngredients(
            data._embedded.cartMenus[key].cartMenuIngredients));
        }
      }
    };
  }

  processCartMenuIngredients(ing: CartMenuIngredient[]) {
    let cartMenuIngredients = new Array<CartMenuIngredient>();
    cartMenuIngredients = [];
    for(const key in ing) {
      if(ing.hasOwnProperty(key)) {
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
    };
    return cartMenuIngredients;
  }
}

