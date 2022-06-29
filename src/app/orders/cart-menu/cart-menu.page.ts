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
import { Item } from 'src/app/classes/item.model';
import { MenuDto } from 'src/app/classes/menu-dto.model';
import { MenuIngredient } from 'src/app/classes/menu-ingredient.model';
import { Menu } from 'src/app/classes/menu.model';
import { Uom } from 'src/app/classes/uom.model';
import { ItemsService } from 'src/app/services/items.service';
import { MenuService } from 'src/app/services/menus.service';
import { ItemSearchComponent } from '../../items/item-search/item-search.component';
@Component({
  selector: 'app-cart-menu',
  templateUrl: './cart-menu.page.html',
  styleUrls: ['./cart-menu.page.scss'],
})
export class CartMenuPage implements OnInit {
  menuForm: FormGroup;
  itemForm: FormGroup;

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
    private menuService: MenuService,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.isFetching = true;
    this.menuForm = new FormGroup({
      menuName: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(30)],
      }),
      remarks: new FormControl('', {
        updateOn: 'blur',
      }),
    });

    this.itemForm = new FormGroup({
      item: new FormControl(null, {
        validators: [Validators.required],
      }),
      itemName: new FormControl(null, {
        validators: [Validators.required],
      }),
      uom: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
      quantity: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.min(0)],
      }),
    });

    this.route.paramMap.subscribe((paramMap) => {
      //Check whether paramMap is empty of not
      if (!paramMap.has('menuId')) {
        this.navCtrl.navigateBack('/tabs/menus');
        return;
      }

      //Check if paramMap is a number
      if (isNaN(Number(paramMap.get('menuId')))) {
        this.navCtrl.navigateBack('/tabs/menus');
        return;
      }

      this.menu = new Menu();
      this.menu.menuId = Number(paramMap.get('menuId'));
      this.menu.price = 0;

      // Get item details
      if (this.menu.menuId > 0) {
        this.postButton = 'checkmark-outline';
        this.menuService.getMenu(this.menu.menuId).subscribe((menuData) => {
          this.menu.menuName = menuData.menuName;
          this.menu.remarks = menuData.remarks;
          this.menu.dateCreated = menuData.dateCreated;
          this.menuForm.patchValue({
            menuName: menuData.menuName,
            remarks: menuData.remarks,
          });
        });

        this.menuService
          .getMenuIngredients(this.menu.menuId)
          .subscribe(this.processMenuIngResult());
      } else {
        this.isFetching = false;
      }
    });
  }

  onItemSearch() {
    this.modalItemSearch
      .create({ component: ItemSearchComponent })
      .then((modalSearch) => {
        modalSearch.present();
        return modalSearch.onDidDismiss();
      })
      .then((resultData) => {
        if (resultData.role === 'item') {
          const itemData = new Item();
          const uomData = new Uom();

          itemData.itemId = resultData.data.itemId;
          itemData.itemName = resultData.data.itemName;

          uomData.uomId = resultData.data.uom.uomId;
          uomData.uomName = resultData.data.uom.uomName;
          uomData.uomCode = resultData.data.uom.uomCode;

          // this.item = resultData.data;
          this.uoms = [uomData];
          this.getItemUoms(itemData.itemId);
          this.itemForm.patchValue({
            item: itemData,
            itemName: itemData.itemName,
            uom: uomData,
            quantity: 0,
          });
        }
      });
  }

  getItemUoms(itemId: number) {
    this.itemService.getItemUoms(itemId).subscribe(this.processResult());
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

  onSaveMenu() {

    if (this.menuForm.valid) {
      if (this.menu.menuId > 0) {
        this.menu.menuName = this.menuForm.value.menuName;
        this.menu.remarks = this.menuForm.value.remarks;
        this.menu.altRemarks = this.getAltRemarks();
        this.menuService.putMenu(this.menu)
        .subscribe(this.processSaveMenu());
      } else {
        this.menuService.postMenu(this.processMenu())
        .subscribe(this.processSaveMenu());
      }
    } else {
      this.messageBox('Invalid menu information.');
    }
  }
  processMenu(): any {
    const menu = new Menu();
    menu.menuName = this.menuForm.value.menuName;
    menu.remarks = this.menuForm.value.remarks;
    menu.altRemarks = this.getAltRemarks();
    menu.price = 0;

    const menuDto = new MenuDto(menu, this.menuIngredients);
    return menuDto;
  }

  processSaveMenu() {
    return (menuData) => {
      this.menuService.menu.next(menuData);
      if (this.menu.menuId) {
        this.messageBox('Menu details has been updated.');
      } else {
        this.navCtrl.navigateBack('/tabs/menus');
      }
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
  onAddIngredient() {
    if (this.itemForm.valid) {
      const ingredient = new MenuIngredient(
        null,
        this.menu.menuId > 0 ? this.menu : null,
        this.itemForm.value.item,
        this.itemForm.value.uom,
        this.itemForm.value.quantity
      );
      if (this.menu.menuId > 0) {
        this.menuService.postMenuIngredient(ingredient).subscribe((res) => {
          this.processIngredient(ingredient);
        });
      } else {
        this.processIngredient(ingredient);
      }
    } else {
      this.messageBox('Incomplete ingredient detail.');
    }
  }

  processIngredient(ing: MenuIngredient) {
    this.messageBox('Ingredient has been added.');
    this.menuIngredients = this.menuIngredients.concat(ing);
    this.itemForm.reset();
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
                this.menuService.deleteMenuIngredient(ing).subscribe((res) => {
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
