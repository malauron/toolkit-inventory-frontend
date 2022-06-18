/* eslint-disable no-underscore-dangle */
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  IonInput,
  IonSelect,
  IonSelectOption,
  ModalController,
} from '@ionic/angular';
import { Subscription } from 'rxjs';
import { ItemUom } from 'src/app/classes/item-uom.model';
import { Item } from 'src/app/classes/item.model';
import { MenuIngredient } from 'src/app/classes/menu-ingredient.model';
import { Uom } from 'src/app/classes/uom.model';
import { ItemsService } from 'src/app/services/items.service';
import { ItemSearchComponent } from '../../items/item-search/item-search.component';

@Component({
  selector: 'app-menu-detail',
  templateUrl: './menu-detail.page.html',
  styleUrls: ['./menu-detail.page.scss'],
})
export class MenuDetailPage implements OnInit {
  menuForm: FormGroup;
  itemForm: FormGroup;

  // item: Item;
  uoms: Uom[] = [];
  menuIngredients: MenuIngredient[] = [];

  pageLabel = 'Menu Detail';
  postButton = 'add';

  menuId: number;

  constructor(
    private modalItemSearch: ModalController,
    private itemService: ItemsService
  ) {}

  ngOnInit() {
    this.menuForm = new FormGroup({
      menuName: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(30)],
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

  onAddIngredient() {
    // const uom =  new Uom();
    // uom.uomId = this.itemForm.value.uomId;
    // uom.uomName = this.itemForm.value.uomName;
    console.log(this.itemForm);
    const ingredient = new MenuIngredient(
      null,
      null,
      this.itemForm.value.item,
      this.itemForm.value.uom,
      this.itemForm.value.quantity
      );

      this.menuIngredients = this.menuIngredients.concat(ingredient);
  }

  onSave() {}
}
