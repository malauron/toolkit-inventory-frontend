/* eslint-disable max-len */
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
import { Warehouse } from 'src/app/classes/warehouse.model';
import { ButcheryBatch } from '../../classes/butchery-batch.model';
import { ButcheryProductionSource } from '../../classes/butchery-production-source.model';
import { ProductionSourceService } from './production-source.service';
import { hasItemIdValidator, hasUomIdValidator } from '../../utils/custom-Validators.directive';
import { ItemCostSearchComponent } from 'src/app/items/item-cost-search/item-cost-search.component';

@Component({
  selector: 'app-production-source',
  templateUrl: './production-source.component.html',
  styleUrls: ['./production-source.component.scss'],
})

export class ProductionSourceComponent implements OnInit, OnDestroy {
  @ViewChild('requiredQtyInput', { static: true }) requiredQtyInput: IonInput;
  @ViewChild('requiredWeightKgInput', { static: true })
  requiredWeightKgInput: IonInput;

  requiredQtySub: Subscription;
  requiredWeightKgSub: Subscription;
  warehouseSub: Subscription;

  warehouse: Warehouse;
  batch: ButcheryBatch;

  pSource = new ButcheryProductionSource();

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
    this.requiredQtySub.unsubscribe();
    this.requiredWeightKgSub.unsubscribe();
    this.warehouseSub.unsubscribe();
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
      requiredQty: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.min(0)],
      }),
      requiredWeightKg: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.min(0)],
      }),
    });

    this.requiredQtySub = this.requiredQtyInput.ionFocus.subscribe(
      this.onRequiredQtyInputFocus()
    );

    this.requiredWeightKgSub = this.requiredWeightKgInput.ionFocus.subscribe(
      this.onRequiredWeightKgInputFocus()
    );

    this.warehouseSub = this.productionSourceService.warehouse.subscribe(
      (res) => {
        this.warehouse = res;
      }
    );
  }

  onRequiredQtyInputFocus() {
    return (res) => {
      const qtyElem = this.requiredQtyInput.getInputElement();
      qtyElem.then((rst) => rst.select());
    };
  }

  onRequiredWeightKgInputFocus() {
    return (res) => {
      const qtyElem = this.requiredWeightKgInput.getInputElement();
      qtyElem.then((rst) => rst.select());
    };
  }

  onItemCostSearch() {
    if (!this.modalOpen) {
      this.modalOpen = true;
      this.modalController
        .create({
          component: ItemCostSearchComponent,
          cssClass: 'custom-modal-styles',
          componentProps: { warehouse: this.warehouse },
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
            const qtyElem = this.requiredQtyInput.getInputElement();
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
    if (!this.pSource) {
      this.isSaving = false;
      return;
    }

    if (!this.itemForm.valid) {
      this.messageBox('Plrease provide a valid production source information.');
      this.isSaving = false;
    } else {
      this.pSource.item = this.itemForm.value.item;
      this.pSource.requiredUom = this.itemForm.value.requiredUom;
      this.pSource.requiredQty = this.itemForm.value.requiredQty;
      this.pSource.requiredWeightKg = this.itemForm.value.requiredWeightKg;

      this.modalController.dismiss(this.pSource, 'item');
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
