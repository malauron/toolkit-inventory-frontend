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
import { ButcheryProductionSource } from '../../classes/butchery-production-source.model';
import { ReceivingItemSearchComponent } from '../../receivings/receiving-item-search/receiving-item-search.component';
import { ReceivingItemSearchService } from '../../receivings/receiving-item-search/receiving-item-search.service';
import { ProductionSourceService } from './production-source.service';

@Component({
  selector: 'app-production-source',
  templateUrl: './production-source.component.html',
  styleUrls: ['./production-source.component.scss'],
})
export class ProductionSourceComponent implements OnInit, OnDestroy {
  @ViewChild('requiredQtyInput', { static: true}) requiredQtyInput: IonInput;

  requiredQtySub: Subscription;
  warehouseSub: Subscription;

  warehouse: Warehouse;

  pSource = new ButcheryProductionSource();

  itemForm: FormGroup;

  uoms: Uom[] = [];

  modalOpen = false;

  isSaving = false;

  constructor(
    private receivingItemSearchService: ReceivingItemSearchService,
    private productionSourceService: ProductionSourceService,
    private modalController: ModalController,
    private toastCtrl: ToastController
  ) {}

  ngOnDestroy(): void {
    this.requiredQtySub.unsubscribe();
    this.warehouseSub.unsubscribe();
  }

  ngOnInit() {
    this.itemForm = new FormGroup({
      requiredQty: new FormControl(0, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.min(0)],
      }),
    });

    this.requiredQtySub = this.requiredQtyInput.ionFocus.subscribe(this.onRequiredQtyInputFocus());

    this.warehouseSub = this.productionSourceService.warehouse.subscribe(res => {
      this.warehouse = res;
    });
  }

  onRequiredQtyInputFocus() {
    return (res) => {
      const qtyElem = this.requiredQtyInput.getInputElement();
      qtyElem.then((rst) => rst.select());
    };
  }

  onReceivedItemSearch() {
    if (!this.modalOpen) {
      this.modalOpen = true;
      this.receivingItemSearchService.warehouse.next(this.warehouse);
      this.modalController
        .create({ component: ReceivingItemSearchComponent })
        .then((modalSearch) => {
          modalSearch.present();
          return modalSearch.onDidDismiss();
        })
        .then((resultData) => {
          if (resultData.role === 'item') {
            this.pSource.butcheryReceivingItem = resultData.data;

            const qtyElem = this.requiredQtyInput.getInputElement();
            qtyElem.then(el => el.focus());
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

    if (!this.pSource.butcheryReceivingItem) {
      this.isSaving = false;
      return;
    }

    if (!this.itemForm.valid) {

      this.messageBox('Plrease provide a valid item information.');
      this.isSaving = false;

    } else {

      this.pSource.requiredQty = this.itemForm.value.requiredQty;

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
