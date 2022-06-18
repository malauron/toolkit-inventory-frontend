import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { ItemUom } from 'src/app/classes/item-uom.model';
import { Item } from 'src/app/classes/item.model';
import { Uom } from 'src/app/classes/uom.model';
import { ItemSearchComponent } from '../../items/item-search/item-search.component';

@Component({
  selector: 'app-menu-detail',
  templateUrl: './menu-detail.page.html',
  styleUrls: ['./menu-detail.page.scss'],
})

export class MenuDetailPage implements OnInit {

  menuForm: FormGroup;
  itemForm: FormGroup;

  item: Item;
  uoms: Uom[]=[];

  pageLabel = 'Menu Detail';
  postButton = 'add';

  menuId: number;

  constructor(private modalItemSearch: ModalController) {}

  ngOnInit() {
    this.menuForm = new FormGroup({
      menuName: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(30)]
      }),
    });

    this.itemForm = new FormGroup({
      itemId: new FormControl(null, {
        validators: [Validators.required]
      }),
      itemName: new FormControl(null, {
        validators: [Validators.required]
      }),
      uomId: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      uomName: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      quantity: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.min(0)]
      })
    });
  }

  onItemSearch() {
    this.modalItemSearch
      .create({ component: ItemSearchComponent })
      .then(modalSearch => {
        modalSearch.present();
        return modalSearch.onDidDismiss();
      })
      .then(resultData => {
        if (resultData.role === 'item') {
          this.item = resultData.data;
          console.log(this.item.uom);
          this.uoms = [this.item.uom];
          this.itemForm.patchValue({
            itemName: this.item.itemName,
            uomId: this.item.uom.uomId,
          });

          console.log(this.itemForm);
        }
      }
      );
  }

  onSave() {}

}
