/* eslint-disable no-underscore-dangle */
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IonInput, IonSelect, ModalController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs/internal/Subscription';
import { Item } from 'src/app/classes/item.model';
import { PurchaseItem } from 'src/app/classes/purchase-item.model';
import { Uom } from 'src/app/classes/uom.model';
import { ItemSearchComponent } from 'src/app/items/item-search/item-search.component';
import { ItemsService } from 'src/app/services/items.service';

@Component({
  selector: 'app-purchased-item',
  templateUrl: './purchased-item.component.html',
  styleUrls: ['./purchased-item.component.scss'],
})
export class PurchasedItemComponent implements OnInit, OnDestroy {
  @ViewChild('uomSelect', { static: true }) uomSelect: IonSelect;
  @ViewChild('quantityInput', { static: true }) quantityInput: IonInput;
  @ViewChild('costInput', { static: true }) costInput: IonInput;

  uomSelectSub: Subscription;
  qtyInputSub: Subscription;
  costInputSub: Subscription;

  itemForm: FormGroup;

  uoms: Uom[] = [];

  modalOpen = false;

  constructor(
    private itemService: ItemsService,
    private modalController: ModalController,
    private toastCtrl: ToastController
  ) {}

  ngOnDestroy(): void {
    this.uomSelectSub.unsubscribe();
    this.qtyInputSub.unsubscribe();
    this.costInputSub.unsubscribe();
  }

  ngOnInit() {
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
      purchasedQty: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.min(0.001)],
      }),
      cost: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.min(0.001)],
      }),
    });

    this.uomSelectSub = this.uomSelect.ionDismiss.subscribe(this.onQtyFocus());
    this.qtyInputSub = this.quantityInput.ionFocus.subscribe(this.onQtyFocus());
    this.costInputSub = this.costInput.ionFocus.subscribe(this.onCostFocus());
  }

  onQtyFocus() {
    return (res) => {
      const qtyElem = this.quantityInput.getInputElement();
      qtyElem.then((rst) => rst.select());
    };
  }

  onCostFocus() {
    return (res) => {
      const qtyElem = this.costInput.getInputElement();
      qtyElem.then((rst) => rst.select());
    };
  }

  onItemSearch() {
    if (!this.modalOpen) {
      this.modalOpen = true;
      this.modalController
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
            itemData.uom = resultData.data.uom;

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
              purchasedQty: 1.0,
              cost: 1.0,
            });

            const qtyElem = this.quantityInput.getInputElement();
            qtyElem.then((res) => res.focus());
          }
          this.modalOpen = false;
        });
    }
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

  onSavePurchasedItem() {
    if (!this.itemForm.valid) {
      this.messageBox('Plrease provide a valid purchased item information.');
    } else {
      const purchaseItem = new PurchaseItem(
        undefined,
        this.itemForm.value.item,
        this.itemForm.value.uom,
        this.itemForm.value.purchasedQty,
        this.itemForm.value.cost
      );
      this.modalController.dismiss(purchaseItem, 'purchasedItem');
    }
  }

  dismissModal() {
    this.modalController.dismiss(null, 'dismissModal');
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
