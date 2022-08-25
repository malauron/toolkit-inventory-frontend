/* eslint-disable no-underscore-dangle */
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  IonInput,
  IonSelect,
  ModalController,
  ToastController,
} from '@ionic/angular';
import { Subscription } from 'rxjs/internal/Subscription';
import { Item } from 'src/app/classes/item.model';
import { Uom } from 'src/app/classes/uom.model';
import { ItemSearchComponent } from 'src/app/items/item-search/item-search.component';
import { ItemsService } from 'src/app/services/items.service';
import { PurchaseItemDetail } from './purchase-item.model';
import { PurchaseItemService } from './purchase-item.service';

@Component({
  selector: 'app-purchased-item',
  templateUrl: './purchased-item.component.html',
  styleUrls: ['./purchased-item.component.scss'],
})
export class PurchasedItemComponent implements OnInit, OnDestroy {
  @ViewChild('uomSelect', { static: true }) uomSelect: IonSelect;
  @ViewChild('quantityInput', { static: true }) quantityInput: IonInput;
  @ViewChild('costInput', { static: true }) costInput: IonInput;

  purchaseItemSub: Subscription;
  uomSelectSub: Subscription;
  qtyInputSub: Subscription;
  costInputSub: Subscription;

  itemForm: FormGroup;

  uoms: Uom[] = [];

  modalOpen = false;

  constructor(
    private itemService: ItemsService,
    private purchaseItemService: PurchaseItemService,
    private modalController: ModalController,
    private toastCtrl: ToastController
  ) {}

  ngOnDestroy(): void {
    this.purchaseItemSub.unsubscribe();
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
      quantity: new FormControl(null, {
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

    this.purchaseItemSub =
      this.purchaseItemService.purchaseItemDetail.subscribe((res) => {
        if (res !== undefined) {
          const itemData = new Item();
          const uomData = new Uom();
          const reqUomData = new Uom();

          itemData.itemId = res.item.itemId;
          itemData.itemName = res.item.itemName;
          itemData.uom = res.item.uom;

          uomData.uomId = res.item.uom.uomId;
          uomData.uomName = res.item.uom.uomName;
          uomData.uomCode = res.item.uom.uomCode;

          reqUomData.uomId = res.uom.uomId;
          reqUomData.uomName = res.uom.uomName;
          reqUomData.uomCode = res.uom.uomCode;

          this.uoms = [];
          this.uoms.push(uomData);
          this.getItemUoms(itemData.itemId, reqUomData);

          this.itemForm.patchValue({
            item: itemData,
            itemName: itemData.itemName,
            uom: uomData,
            quantity: res.quantity,
            cost: res.cost,
          });

          const qtyElem = this.quantityInput.getInputElement();
          qtyElem.then((rs) => rs.focus());
        }
      });
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
            this.uoms = [];
            this.uoms = this.uoms.concat(uomData) ;
            this.getItemUoms(itemData.itemId);
            this.itemForm.patchValue({
              item: itemData,
              itemName: itemData.itemName,
              uom: uomData,
              quantity: 1.0,
              cost: 1.0,
            });

            const qtyElem = this.quantityInput.getInputElement();
            qtyElem.then((res) => res.focus());
          }
          this.modalOpen = false;
        });
    }
  }

  getItemUoms(itemId: number, selectedUom?: Uom) {
    this.itemService
      .getItemUoms(itemId)
      .subscribe(this.processResult(selectedUom));
  }

  processResult(selectedUom?: Uom) {
    return (data) => {
      const itemUoms = [];
      for (const key in data._embedded.itemUoms) {
        if (data._embedded.itemUoms.hasOwnProperty(key)) {
          // this.uoms = this.uoms.concat(data._embedded.itemUoms[key].uom);
          this.uoms.push(data._embedded.itemUoms[key].uom);
        }
      }

      console.log(this.uoms);
      console.log(selectedUom);

      // if (selectedUom !== undefined) {
      //   this.itemForm.patchValue({
      //     uom: selectedUom
      //   });
      // }
    };
  }

  onSavePurchasedItem() {
    if (!this.itemForm.valid) {
      this.messageBox('Plrease provide a valid item information.');
    } else {
      const purchaseItemDetail = new PurchaseItemDetail(
        this.itemForm.value.item,
        this.itemForm.value.uom,
        this.itemForm.value.quantity,
        this.itemForm.value.cost
      );
      this.modalController.dismiss(purchaseItemDetail, 'item');
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
