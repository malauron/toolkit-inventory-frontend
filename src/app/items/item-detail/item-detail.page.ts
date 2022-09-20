/* eslint-disable no-underscore-dangle */
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  AlertController,
  IonInput,
  ModalController,
  NavController,
  ToastController,
} from '@ionic/angular';
import { Subscription } from 'rxjs';
import { ItemDto } from 'src/app/classes/item-dto.model';
import { ItemUom } from 'src/app/classes/item-uom.model';
import { Item } from 'src/app/classes/item.model';
import { ItemUomId } from 'src/app/classes/ItemUomId.model';
import { Uom } from 'src/app/classes/uom.model';
import { ItemsService } from 'src/app/services/items.service';
import { UomsService } from 'src/app/services/uoms.service';
import { ItemSearchComponent } from '../item-search/item-search.component';

@Component({
  selector: 'app-item-detail',
  templateUrl: './item-detail.page.html',
  styleUrls: ['./item-detail.page.scss'],
})
export class ItemDetailPage implements OnInit {
  @ViewChild('quantityInput', { static: true }) quantityInput: IonInput;

  pageLabel = 'Item Detail';
  postButton = 'checkmark-outline';

  itemForm: FormGroup;
  itemUomForm: FormGroup;
  itemBomForm: FormGroup;

  item: Item;
  baseUom: Uom;

  uoms: Uom[];
  uomsForBom: Uom[];
  itemUoms: ItemUom[];
  bomUoms: ItemUom[];

  modalOpen = false;

  private itemSubscription: Subscription;
  private uomSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private itemService: ItemsService,
    private uomService: UomsService,
    private toastController: ToastController,
    private alertCtrl: AlertController,
    private modalItemSearch: ModalController
  ) {}

  ngOnInit() {
    this.uoms = [];
    this.itemUoms = [];
    this.bomUoms = [];

    this.itemForm = new FormGroup({
      itemName: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(50)],
      }),
      uom: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
      itemClass: new FormControl('Stock', {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
      isActive: new FormControl(true, {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
    });

    this.itemUomForm = new FormGroup({
      itemUomId: new FormGroup({
        item: new FormControl(null),
        uom: new FormControl(null, {
          updateOn: 'blur',
          validators: [Validators.required],
        }),
      }),
      quantity: new FormControl({
        updateOn: 'blur',
        validators: [Validators.required],
      }),
    });

    this.itemBomForm = new FormGroup({
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
        validators: [Validators.required, Validators.min(1)],
      }),
    });

    this.route.paramMap.subscribe((paramMap) => {
      // Check whether paramMap is empty or not
      if (!paramMap.has('itemId')) {
        this.navCtrl.navigateBack('/tabs/items');
        return;
      }

      // Check if paramMap is a number
      if (isNaN(Number(paramMap.get('itemId')))) {
        this.navCtrl.navigateBack('/tabs/items');
        return;
      }

      this.item = new Item();
      this.item.itemId = Number(paramMap.get('itemId'));

      // Assign the item id to each
      // new item uom
      this.itemUomForm.patchValue({
        itemUomId: {
          itemId: this.item.itemId,
        },
      });

      if (this.item.itemId > 0) {
        this.postButton = 'checkmark-outline';

        // Get item details
        this.itemSubscription = this.itemService
          .getItem(this.item.itemId)
          .subscribe(
            (itemApiData) => {
              this.item.itemName = itemApiData.itemName;
              this.item.dateCreated = itemApiData.dateCreated;
              this.item.itemClass = itemApiData.itemClass;
              this.item.isActive = itemApiData.isActive;
              this.baseUom = itemApiData.uom;

              // // Fetch all UoMs
              this.fetchAllUoms(itemApiData);

              // Fecth all uoms for this item
              this.getItemUoms(this.item.itemId);
            },
            (error) => {
              this.navCtrl.navigateBack('/tabs/items');
              return;
            }
          );
      } else {
        this.pageLabel = 'New Item';
        this.fetchAllUoms();
      }
    });
  }

  // Fetch all UoMs
  fetchAllUoms(itemResData?: Item) {
    this.uomSubscription = this.uomService
      .findAllUoms()
      .subscribe((uomApiData) => {
        this.uoms = [];
        for (const key in uomApiData._embedded.uoms) {
          if (uomApiData._embedded.uoms.hasOwnProperty(key)) {
            const uom = new Uom();
            uom.uomId = uomApiData._embedded.uoms[key].uomId;
            uom.uomCode = uomApiData._embedded.uoms[key].uomCode;
            uom.uomName = uomApiData._embedded.uoms[key].uomName;
            if (itemResData) {
              if (itemResData.uom.uomId === uom.uomId) {
                this.item.uom = uom;
              }
            }
            this.uoms = this.uoms.concat(uom);
          }
        }

        if (itemResData) {
          this.itemForm.patchValue({
            itemName: itemResData.itemName,
            uom: this.item.uom,
            itemClass: itemResData.itemClass,
            isActive: itemResData.isActive,
          });
        }
      });
  }

  getItemUoms(itemId: number) {
    this.itemService.getItemUoms(itemId).subscribe(this.processResult());
  }

  processResult() {
    return (data) => {
      this.itemUoms = data.itemUoms;
    };
  }

  onSave() {
    if (this.itemForm.valid) {
      this.item.itemName = this.itemForm.value.itemName;
      this.item.uom = this.itemForm.value.uom;
      this.item.itemClass = this.itemForm.value.itemClass;
      this.item.isActive = this.itemForm.value.isActive;

      const itemDto = new ItemDto();
      itemDto.item = this.item;

      if (this.item.itemId > 0) {
        this.itemService.putItem(itemDto).subscribe(this.processSaveItem());
      } else {
        itemDto.itemUoms = this.itemUoms;
        this.itemService.postItem(itemDto).subscribe(this.processSaveItem());
      }
    } else {
      this.messageBox('Invalid item information.');
    }
  }

  processSaveItem() {
    return (itemData) => {
      this.itemService.item.next(itemData);
      if (this.item.itemId) {
        this.messageBox('Item details has been updated.');
      } else {
        this.item.itemId = itemData.item.itemId;
        this.messageBox('Item has been saved successfully.');
      }
    };
  }

  onBaseUomChange(baseUom: Uom) {
    this.baseUom = baseUom;
  }

  onAddUom() {
    if (this.baseUom === undefined) {
      this.messageBox('Please specify a base UoM.');
      return;
    }
    if (this.itemUomForm.valid) {
      if (isNaN(this.itemUomForm.value.quantity)) {
        this.messageBox('Invalid quantity.');
      } else {
        const itemUom = new ItemUom();

        itemUom.uomId = this.itemUomForm.value.itemUomId.uom.uomId;
        itemUom.uom = this.itemUomForm.value.itemUomId.uom;
        itemUom.quantity = this.itemUomForm.value.quantity;

        if (this.item.itemId > 0) {
          itemUom.itemId = this.item.itemId;
          itemUom.item = this.item;

          this.itemService
            .postItemUoms(itemUom)
            .subscribe(this.processSaveUom());
        } else {
          this.itemUoms = this.itemUoms.concat(itemUom);
          this.itemUomForm.reset();
        }
      }
    } else {
      this.messageBox('Invalid UoM details.');
    }
  }

  onSaveUom() {
    if (this.itemUomForm.valid) {
      if (isNaN(this.itemUomForm.value.quantity)) {
        this.messageBox('Invalid quantity.');
      } else {
        this.itemService
          .postItemUoms(this.itemUomForm.value)
          .subscribe(this.processSaveUom());
      }
    } else {
      this.messageBox('Invalid UoM details.');
    }
  }

  processSaveUom() {
    return (itemUom) => {
      this.getItemUoms(this.item.itemId);
      this.messageBox('UoM has been saved.');
      this.itemUomForm.reset();
      // this.itemUoms = this.itemUoms.concat(itemUom);
    };
  }

  onDeleteItemUom(data: ItemUom) {
    this.alertCtrl
      .create({
        header: 'Confirm',
        message: 'This will be deleted permanently .',
        buttons: [
          {
            text: 'Cancel',
          },
          {
            text: 'Delete',
            handler: () => {
              if (this.item.itemId > 0) {
                const itemUom = new ItemUom();
                itemUom.itemId = data.itemId;
                itemUom.uomId = data.uomId;
                this.itemService.deleteItemUoms(itemUom).subscribe((res) => {
                  this.messageBox('Unit of measure has been deleted.');
                  this.getItemUoms(this.item.itemId);
                });
              } else {
                for (const key in this.itemUoms) {
                  if (data === this.itemUoms[key]) {
                    this.itemUoms.splice(Number(key), 1);
                  }
                }
              }
            },
          },
        ],
      })
      .then((res) => {
        res.present();
      });
  }

  onItemSearch() {
    if (!this.modalOpen) {
      this.modalOpen = true;
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

            this.uomsForBom = [uomData];

            this.itemService.getItemUoms(itemData.itemId).subscribe((res) => {
              const itemUoms = [];
              for (const key in res.itemUoms) {
                if (res.itemUoms.hasOwnProperty(key)) {
                  this.uomsForBom = this.uomsForBom.concat(res.itemUoms[key].uom);
                }
              }
            });

            this.itemBomForm.patchValue({
              item: itemData,
              itemName: itemData.itemName,
              uom: uomData,
              quantity: 1,
            });

            const qtyElem = this.quantityInput.getInputElement();
            qtyElem.then((res) => res.focus());
          }
          this.modalOpen = false;
        });
    }
  }
  async messageBox(msg: string) {
    const toast = await this.toastController.create({
      color: 'dark',
      duration: 2000,
      position: 'top',
      message: msg,
    });

    await toast.present();
  }
}
