import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IonInput, ModalController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Item } from 'src/app/classes/item.model';
import { Uom } from 'src/app/classes/uom.model';
import { ItemSearchComponent } from 'src/app/items/item-search/item-search.component';
import { ButcheryProductionItem } from '../../classes/butchery-production-item.model';
import { hasItemIdValidator, hasUomIdValidator } from '../../utils/custom-Validators.directive';
import { ProductionSourceService } from '../production-source/production-source.service';

@Component({
  selector: 'app-production-item',
  templateUrl: './production-item.component.html',
  styleUrls: ['./production-item.component.scss'],
})
export class ProductionItemComponent implements OnInit, OnDestroy {
  @ViewChild('producedQtyInput', { static: true }) producedQtyInput: IonInput;
  @ViewChild('producedWeightKgInput', { static: true })
  producedWeightKgInput: IonInput;

  producedQtySub: Subscription;
  producedWeightKgSub: Subscription;

  producedItem = new ButcheryProductionItem();

  itemForm: FormGroup;

  uoms: Uom[] = [];

  modalOpen = false;

  isSaving = false;

  constructor(
    private productionSourceService: ProductionSourceService,
    private modalController: ModalController,
    private toastCtrl: ToastController
  ) {}

  get itemName() {
    return this.itemForm.value.item.itemName;
  }

  get uomName() {
    return this.itemForm.value.requiredUom.uomName;
  }

  ngOnDestroy(): void {
    this.producedQtySub.unsubscribe();
    this.producedWeightKgSub.unsubscribe();
  }

  ngOnInit() {
    this.itemForm = new FormGroup({
      item: new FormControl(new Item(), {
        updateOn: 'blur',
        validators: [Validators.required, hasItemIdValidator()],
      }),
      requiredUom: new FormControl(new Uom(), {
        updateOn: 'blur',
        validators: [Validators.required, hasUomIdValidator()],
      }),
      producedQty: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.min(0)],
      }),
      producedWeightKg: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.min(0)],
      }),
    });

    this.producedQtySub = this.producedQtyInput.ionFocus.subscribe(
      this.onProducedQtyInputFocus()
    );

    this.producedWeightKgSub = this.producedWeightKgInput.ionFocus.subscribe(
      this.onProducedWeightKgInputFocus()
    );
  }

  onProducedQtyInputFocus() {
    return (res) => {
      const qtyElem = this.producedQtyInput.getInputElement();
      qtyElem.then((rst) => rst.select());
    };
  }

  onProducedWeightKgInputFocus() {
    return (res) => {
      const qtyElem = this.producedWeightKgInput.getInputElement();
      qtyElem.then((rst) => rst.select());
    };
  }

  onItemSearch() {
    if (!this.modalOpen) {
      this.modalOpen = true;
      this.modalController
        .create({
          component: ItemSearchComponent,
          cssClass: 'custom-modal-styles',
          // componentProps: { batchId: this.batch.butcheryBatchId },
        })
        .then((modalSearch) => {
          modalSearch.present();
          return modalSearch.onDidDismiss();
        })
        .then((resultData) => {
          if (resultData.role === 'item') {
            this.itemForm.patchValue({
              item: resultData.data,
              requiredUom: resultData.data.uom,
            });
            const qtyElem = this.producedQtyInput.getInputElement();
            qtyElem.then((el) => el.focus());
          }
          this.modalOpen = false;
        });
    }
  }

  onSaveReceivedItem() {
    if (this.isSaving) {
      return;
    }

    this.isSaving = true;
    if (!this.producedItem) {
      this.isSaving = false;
      return;
    }

    if (!this.itemForm.valid) {
      this.messageBox('Plrease provide a valid production source information.');
      this.isSaving = false;
    } else {
      this.producedItem.item = this.itemForm.value.item;
      this.producedItem.requiredUom = this.itemForm.value.requiredUom;
      this.producedItem.producedQty = this.itemForm.value.producedQty;
      this.producedItem.producedWeightKg = this.itemForm.value.producedWeightKg;

      this.modalController.dismiss(this.producedItem, 'item');
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
