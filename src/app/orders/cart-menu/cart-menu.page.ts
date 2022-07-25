/* eslint-disable no-underscore-dangle */
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  AlertController,
  ModalController,
  NavController,
  ToastController,
} from '@ionic/angular';
import { CartMenuDto } from 'src/app/classes/cart-menu-dto.model';
import { CartMenuIngredient } from 'src/app/classes/cart-menu-ingredient.model';
import { CartMenu } from 'src/app/classes/cart-menu.model';
import { Item } from 'src/app/classes/item.model';
import { MenuDto } from 'src/app/classes/menu-dto.model';
import { MenuIngredient } from 'src/app/classes/menu-ingredient.model';
import { Menu } from 'src/app/classes/menu.model';
import { Uom } from 'src/app/classes/uom.model';
import { CartsService } from 'src/app/services/carts.service';
import { ItemsService } from 'src/app/services/items.service';
import { MenusService } from 'src/app/services/menus.service';
import { ItemSearchComponent } from '../../items/item-search/item-search.component';
@Component({
  selector: 'app-cart-menu',
  templateUrl: './cart-menu.page.html',
  styleUrls: ['./cart-menu.page.scss'],
})
export class CartMenuPage implements OnInit {
  // menuForm: FormGroup;
  // itemForm: FormGroup;

  uoms: Uom[] = [];
  menuIngredients: MenuIngredient[] = [];

  pageLabel = 'Cart Menu';
  postButton = 'add';
  quantity = 1;

  menu: Menu;

  isFetching = false;

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private modalItemSearch: ModalController,
    private alertCtrl: AlertController,
    private itemService: ItemsService,
    private menusService: MenusService,
    private cartsService: CartsService,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.isFetching = true;
    this.route.paramMap.subscribe((paramMap) => {
      //Check whether paramMap is empty of not
      if (!paramMap.has('menuId')) {
        this.navCtrl.navigateBack('/tabs/orders');
        return;
      }

      //Check if paramMap is a number
      if (isNaN(Number(paramMap.get('menuId')))) {
        this.navCtrl.navigateBack('/tabs/orders');
        return;
      }

      this.menu = new Menu();
      this.menu.menuId = Number(paramMap.get('menuId'));
      this.menu.price = 0;

      // Get item details
      if (this.menu.menuId > 0) {
        this.postButton = 'checkmark-outline';
        this.menusService.getMenu(this.menu.menuId).subscribe((menuData) => {
          this.menu.menuName = menuData.menuName;
          this.menu.remarks = menuData.remarks;
          this.menu.dateCreated = menuData.dateCreated;
        });

        this.menusService
          .getMenuIngredients(this.menu.menuId)
          .subscribe(this.processMenuIngResult());
      } else {
        this.isFetching = false;
      }
    });
  }

  processResult() {
    return (data) => {
      const itemUoms = [];
      for (const key in data._embedded.itemUoms) {
        if (data._embedded.itemUoms.hasOwnProperty(key)) {
          this.uoms = this.uoms.concat(data._embedded.itemUoms[key].uom);
        }
      }
    };
  }

  processMenuIngResult() {
    return (data) => {
      this.menuIngredients = [];
      for (const key in data._embedded.menuIngredients) {
        if (data._embedded.menuIngredients.hasOwnProperty(key)) {
          const ingredient = new MenuIngredient(
            data._embedded.menuIngredients[key].menuIngredientId,
            this.menu,
            data._embedded.menuIngredients[key]._embedded.item,
            data._embedded.menuIngredients[key]._embedded.requiredUom,
            data._embedded.menuIngredients[key].requiredQty
          );
          this.menuIngredients = this.menuIngredients.concat(ingredient);
        }
      }
      this.isFetching = false;
    };
  }

  onSaveCartMenu() {

    this.cartsService.postCartMenu(this.processCartMenu())
      .subscribe(this.processSaveMenu());

  }

  processCartMenu(): any {

    const cartMenuDto = new CartMenuDto();
    const cartMenu = new CartMenu();


    cartMenu.menu = this.menu;
    cartMenu.orderQty = this.quantity;
    cartMenu.price = 0;
    cartMenu.lineTotal = 0;

    cartMenuDto.cartMenu = cartMenu;
    cartMenuDto.cartMenuIngredients = [];

    this.menuIngredients.forEach((ing) => {
      const cartMenuIngredient = new CartMenuIngredient();
      cartMenuIngredient.item = ing.item;
      cartMenuIngredient.baseUom = ing.item.uom;
      cartMenuIngredient.baseQty = 1;
      cartMenuIngredient.orderedQty = this.quantity;
      cartMenuIngredient.requiredUom = ing.requiredUom;
      cartMenuIngredient.requiredQty = ing.requiredQty;
      cartMenuDto.cartMenuIngredients = cartMenuDto.cartMenuIngredients.concat(cartMenuIngredient);

    });

    return cartMenuDto;

  }

  processSaveMenu() {
    return (menuData) => {

      this.messageBox('Menu has been added to the cart.');
      this.navCtrl.navigateBack('/tabs/orders');
    };
  }

  getAltRemarks() {

    let altRemarks = '';
    this.menuIngredients.forEach((ing) => {
      if (altRemarks.length !== 0) {
        altRemarks = altRemarks + ',';
      }
      altRemarks = `${altRemarks} ${ing.item.itemName} - ${ing.requiredQty}${ing.requiredUom.uomCode}`;
    });
    return altRemarks;

  }

  onDeleteIngredient(ing: MenuIngredient) {
    this.alertCtrl
      .create({
        header: 'Confirm',
        message: 'This will be permanently deleted.',
        buttons: [
          {
            text: 'Cancel',
          },
          {
            text: 'Delete',
            handler: () => {
              if (this.menu.menuId > 0) {
                this.menusService.deleteMenuIngredient(ing).subscribe((res) => {
                  this.removeIngredientObj(ing);
                });
              } else {
                this.removeIngredientObj(ing);
              }
            },
          },
        ],
      })
      .then((res) => {
        res.present();
      });
  }

  removeIngredientObj(ing: MenuIngredient) {
    for (const key in this.menuIngredients) {
      if (ing === this.menuIngredients[key]) {
        this.menuIngredients.splice(Number(key), 1);
      }
    }
  }

  incrementQty() {
    this.quantity += 1;
  }

  decrementQty() {
    if (this.quantity < 2) {
      this.quantity = 1;
    } else {
      this.quantity -= 1;
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
