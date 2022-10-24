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
import { ReceivedItemDetail } from './received-item.model';
import { ReceivedItemService } from './received-item.service';

@Component({
  selector: 'app-received-item',
  templateUrl: './received-item.component.html',
  styleUrls: ['./received-item.component.scss'],
})
export class ReceivedItemComponent implements OnInit, OnDestroy {
  @ViewChild('uomSelect', { static: true }) uomSelect: IonSelect;
  @ViewChild('receivedQtyInput', { static: true }) receivedQtyInput: IonInput;
  @ViewChild('itemCostInput', { static: true }) itemCostInput: IonInput;
  @ViewChild('documentedWeightInput', { static: true }) documentedWeightInput: IonInput;
  @ViewChild('actualWeightInput', { static: true }) actualWeightInput: IonInput;

  receivedItemSub: Subscription;
  uomSelectSub: Subscription;
  receivedQtyInputSub: Subscription;
  itemCostInputSub: Subscription;
  documentedWeightInputSub: Subscription;
  actualWeightInputSub: Subscription;

  itemForm: FormGroup;

  uoms: Uom[] = [];

  modalOpen = false;

  constructor(
    private itemService: ItemsService,
    private receivedItemService: ReceivedItemService,
    private modalController: ModalController,
    private toastCtrl: ToastController
  ) {}

  ngOnDestroy(): void {
    this.receivedItemSub.unsubscribe();
    this.uomSelectSub.unsubscribe();
    this.receivedQtyInputSub.unsubscribe();
    this.itemCostInputSub.unsubscribe();
    this.documentedWeightInputSub.unsubscribe();
    this.actualWeightInputSub.unsubscribe();
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
      receivedQty: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.min(0.001)],
      }),
      itemCost: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.min(0)],
      }),
      documentedWeight: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.min(0)],
      }),
      actualWeight: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.min(0)],
      }),
    });

    this.uomSelectSub = this.uomSelect.ionDismiss.subscribe(this.onQtyFocus());
    this.receivedQtyInputSub = this.receivedQtyInput.ionFocus.subscribe(this.onQtyFocus());
    this.itemCostInputSub = this.itemCostInput.ionFocus.subscribe(this.onCostFocus());
    this.documentedWeightInputSub = this.documentedWeightInput.ionFocus.subscribe(this.onDocumentedWeightFocus());
    this.actualWeightInputSub = this.actualWeightInput.ionFocus.subscribe(this.onActualWeightFocus());

    this.receivedItemSub =
      this.receivedItemService.receivedItemDetail.subscribe((res) => {
        if (res !== undefined) {
          const itemData = new Item();
          const uomData = new Uom();
          const reqUomData = new Uom();

          itemData.itemId = res.item.itemId;
          itemData.itemName = res.item.itemName;
          itemData.itemCode = res.item.itemCode;
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

          if (uomData.uomId === reqUomData.uomId) {
            this.itemForm.patchValue({
              item: itemData,
              itemName: itemData.itemName,
              uom: uomData,
              receivedQty: res.receivedQty,
              itemCost: res.itemCost,
            });
          } else {
            this.itemForm.patchValue({
              item: itemData,
              itemName: itemData.itemName,
              receivedQty: res.receivedQty,
              itemCost: res.itemCost,
            });
          }

          const qtyElem = this.receivedQtyInput.getInputElement();
          qtyElem.then((rs) => rs.focus());
        }
      });
  }

  onQtyFocus() {
    return (res) => {
      const qtyElem = this.receivedQtyInput.getInputElement();
      qtyElem.then((rst) => rst.select());
    };
  }

  onCostFocus() {
    return (res) => {
      const qtyElem = this.itemCostInput.getInputElement();
      qtyElem.then((rst) => rst.select());
    };
  }

  onDocumentedWeightFocus() {
    return (res) => {
      const qtyElem = this.documentedWeightInput.getInputElement();
      qtyElem.then((rst) => rst.select());
    };
  }

  onActualWeightFocus() {
    return (res) => {
      const qtyElem = this.actualWeightInput.getInputElement();
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
            itemData.itemCode = resultData.data.itemCode;
            itemData.uom = resultData.data.uom;

            uomData.uomId = resultData.data.uom.uomId;
            uomData.uomName = resultData.data.uom.uomName;
            uomData.uomCode = resultData.data.uom.uomCode;

            // this.item = resultData.data;
            this.uoms = [];
            this.uoms = this.uoms.concat(uomData);
            this.getItemUoms(itemData.itemId);
            this.itemForm.patchValue({
              item: itemData,
              itemName: itemData.itemName,
              uom: uomData,
              receivedQty: 1.0,
              itemCost: 0.00,
              documentedWeight: 0.00,
              actualWeight: 0.00,
            });

            const qtyElem = this.receivedQtyInput.getInputElement();
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
      for (const key in data.itemUoms) {
        if (data.itemUoms.hasOwnProperty(key)) {

          const newUom = new Uom();

          newUom.uomId = data.itemUoms[key].uom.uomId;
          newUom.uomName = data.itemUoms[key].uom.uomName;
          newUom.uomCode = data.itemUoms[key].uom.uomCode;

          this.uoms.push(newUom);

          if (selectedUom !== undefined) {
            if (selectedUom.uomId === newUom.uomId) {
              this.itemForm.patchValue({
                uom: newUom,
              });
            }
          }
        }
      }
    };
  }

  onSaveReceivedItem() {
    if (!this.itemForm.valid) {
      this.messageBox('Plrease provide a valid item information.');
    } else {
      const receivedItemDetail = new ReceivedItemDetail();
      receivedItemDetail.item = this.itemForm.value.item;
      receivedItemDetail.uom = this.itemForm.value.uom;
      receivedItemDetail.receivedQty = this.itemForm.value.receivedQty;
      receivedItemDetail.itemCost = this.itemForm.value.itemCost;
      receivedItemDetail.documentedWeight = this.itemForm.value.documentedWeight;
      receivedItemDetail.actualWeight = this.itemForm.value.actualWeight;

      this.modalController.dismiss(receivedItemDetail, 'item');
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
