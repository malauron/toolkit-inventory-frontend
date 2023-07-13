/* eslint-disable no-underscore-dangle */
import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  AlertController,
  IonInput,
  IonToggle,
  ModalController,
  NavController,
  ToastController,
} from '@ionic/angular';
import { Subject, Subscription } from 'rxjs';
import { ItemBom } from 'src/app/classes/item-bom.model';
import { ItemClass } from 'src/app/classes/item-class.model';
import { ItemDto } from 'src/app/classes/item-dto.model';
import { ItemGeneric } from 'src/app/classes/item-generic.model';
import { ItemUom } from 'src/app/classes/item-uom.model';
import { Item } from 'src/app/classes/item.model';
import { Uom } from 'src/app/classes/uom.model';
import { ItemsService } from 'src/app/services/items.service';
import { UomsService } from 'src/app/services/uoms.service';
import { AddOnsServices } from '../item-add-ons/services/add-ons.service';
import { ItemSearchComponent } from '../item-search/item-search.component';

@Component({
  selector: 'app-item-detail',
  templateUrl: './item-detail.page.html',
  styleUrls: ['./item-detail.page.scss'],
})
export class ItemDetailPage implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('quantityInput', { static: true }) quantityInput: IonInput;
  @ViewChild('isWeightBasedCostOpt') isWeightBasedCostOpt: IonToggle;

  pageLabel = 'Item Detail';
  postButton = 'checkmark-outline';

  itemForm: FormGroup;
  itemUomForm: FormGroup;
  itemBomForm: FormGroup;
  itemGenericForm: FormGroup;

  selectedPicture: any;
  displayPicture: any;
  displayImg: any;

  item: Item;
  baseUom: Uom;
  itemGeneric: ItemGeneric;

  uoms: Uom[];
  uomsForBom: Uom[];
  uomsForGeneric: Uom[];
  itemUoms: ItemUom[];
  itemBoms: ItemBom[];

  modalOpen = false;
  isUploading = false;
  lockControls = false;

  private subjectGenericUom = new Subject<Uom>();
  private itemSubscription: Subscription;
  private uomSubscription: Subscription;
  private genericUomSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private itemService: ItemsService,
    private uomService: UomsService,
    private addOnsService: AddOnsServices,
    private toastController: ToastController,
    private alertCtrl: AlertController,
    private modalItemSearch: ModalController
  ) {}

  get theItemClass() {
    return ItemClass;
  }

  ngOnDestroy(): void {
    if (this.itemSubscription !== undefined) {
      this.itemSubscription.unsubscribe();
    }
    if (this.uomSubscription !== undefined) {
      this.uomSubscription.unsubscribe();
    }
    if (this.genericUomSubscription !== undefined) {
      this.genericUomSubscription.unsubscribe();
    }
  }

  ngOnInit() {
    this.uoms = [];
    this.itemUoms = [];
    this.itemBoms = [];
    this.itemGeneric = new ItemGeneric();
    this.addOnsService.setItemAddOnDetails([]);

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
      this.item.itemClass = ItemClass.Stock;

      this.addOnsService.setItem(this.item);

      if (this.item.itemId > 0) {
        this.lockControls = true;
      }

      this.itemForm = new FormGroup({
        itemCode: new FormControl(null, {
          updateOn: 'blur',
          validators: [Validators.required, Validators.maxLength(20)],
        }),
        itemName: new FormControl(null, {
          updateOn: 'blur',
          validators: [Validators.required, Validators.maxLength(80)],
        }),
        uom: new FormControl(
          { value: null, disabled: this.lockControls }
          // {
          //   updateOn: 'blur',
          //   validators: [Validators.required],
          // }
        ),
        itemClass: new FormControl(
          { value: ItemClass.Stock, disabled: this.lockControls },
          {
            updateOn: 'blur',
            validators: [Validators.required],
          }
        ),
        price: new FormControl(null, {
          updateOn: 'blur',
          validators: [Validators.required, Validators.min(0)],
        }),
        isActive: new FormControl(true, {
          updateOn: 'blur',
          validators: [Validators.required],
        }),
        isWeighable: new FormControl({
          value: false,
          disabled: this.lockControls,
        }),
        isWeightBasedCost: new FormControl({
          value: false,
          disabled: this.lockControls,
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
        subItem: new FormControl(null, {
          validators: [Validators.required],
        }),
        subItemName: new FormControl(null, {
          validators: [Validators.required],
        }),
        requiredUom: new FormControl(null, {
          updateOn: 'blur',
          validators: [Validators.required],
        }),
        requiredQty: new FormControl(null, {
          updateOn: 'blur',
          validators: [Validators.required, Validators.min(0.001)],
        }),
      });

      this.itemGenericForm = new FormGroup({
        itemGenericId: new FormControl(null),
        subItem: new FormControl(null, {
          validators: [Validators.required],
        }),
        subItemName: new FormControl(null, {
          validators: [Validators.required],
        }),
        requiredUom: new FormControl(null, {
          updateOn: 'blur',
          validators: [Validators.required],
        }),
        requiredQty: new FormControl(null, {
          updateOn: 'blur',
          validators: [Validators.required, Validators.min(0.001)],
        }),
      });

      this.genericUomSubscription = this.subjectGenericUom.subscribe((uom) => {
        this.itemGenericForm.patchValue({
          requiredUom: uom,
        });
      });

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
              this.item.itemCode = itemApiData.itemCode;
              this.item.itemName = itemApiData.itemName;
              this.item.dateCreated = itemApiData.dateCreated;
              this.item.itemClass = itemApiData.itemClass;
              this.item.price = itemApiData.price;
              this.item.isActive = itemApiData.isActive;
              this.item.isWeighable = itemApiData.isWeighable;
              this.item.isWeightBasedCost = itemApiData.isWeightBasedCost;
              this.baseUom = itemApiData.uom;

              // // Fetch base uoms
              this.getBaseUom(itemApiData);

              // Fecth alternative uoms for this item
              this.getItemUoms(this.item.itemId);

              // Fetch all boms for this item
              this.getItemBoms(this.item.itemId);

              // Fetch all add-ons
              this.getItemAddOns(this.item.itemId);

              //Fetch generic item
              this.getItemGeneric(this.item.itemId);
            },
            (error) => {
              this.navCtrl.navigateBack('/tabs/items');
              return;
            }
          );
      } else {
        this.pageLabel = 'New Item';
        this.getBaseUom();
      }
    });
  }

  ngAfterViewInit(): void {
    if (this.item.itemId === 0 || this.lockControls) {
      console.log('sdfads');
      this.isWeightBasedCostOpt.disabled = true;
    }
  }

  // Fetch all UoMs
  getBaseUom(itemResData?: Item) {
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
              if (itemResData.uom) {
                if (itemResData.uom.uomId === uom.uomId) {
                  this.item.uom = uom;
                }
              }
            }
            this.uoms = this.uoms.concat(uom);
          }
        }

        if (itemResData) {
          this.itemForm.patchValue({
            itemCode: itemResData.itemCode,
            itemName: itemResData.itemName,
            uom: this.item.uom,
            itemClass: itemResData.itemClass,
            price: itemResData.price,
            isActive: itemResData.isActive,
            isWeighable: itemResData.isWeighable,
            isWeightBasedCost: itemResData.isWeightBasedCost,
          });
        }
      });
  }

  getItemUoms(itemId: number) {
    this.itemService.getItemUoms(itemId).subscribe(this.processResult());
  }

  getItemBoms(itemId: number) {
    this.itemService.getItemBoms(itemId).subscribe((res) => {
      this.itemBoms = res.itemBoms;
    });
  }

  getItemAddOns(itemId: number) {
    this.itemService.getItemAddOnDetails(itemId).subscribe((res) => {
      this.addOnsService.setItemAddOnDetails(res._embedded.itemAddOnDetails);
    });
  }

  getItemGeneric(itemId: number) {
    this.itemService.getItemGenerics(itemId).subscribe((res1) => {
      if (res1.itemGeneric) {
        this.itemGenericForm.patchValue({
          itemGenericId: res1.itemGeneric.itemGenericId,
          subItem: res1.itemGeneric.subItem,
          subItemName: res1.itemGeneric.subItem.itemName,
          requiredQty: res1.itemGeneric.requiredQty,
        });

        this.uomsForGeneric = [];

        const requriedUom = res1.itemGeneric.requiredUom;
        const defaultUom = res1.itemGeneric.subItem.uom;

        if (requriedUom.uomId === defaultUom.uomId) {
          this.subjectGenericUom.next(defaultUom);
        }

        this.uomsForGeneric = this.uomsForGeneric.concat(defaultUom);

        this.itemService
          .getItemUoms(res1.itemGeneric.subItem.itemId)
          .subscribe((res2) => {
            for (const key in res2.itemUoms) {
              if (res2.itemUoms.hasOwnProperty(key)) {
                let uom = new Uom();
                uom = res2.itemUoms[key].uom;
                if (requriedUom.uomId === uom.uomId) {
                  this.subjectGenericUom.next(uom);
                }
                this.uomsForGeneric = this.uomsForGeneric.concat(uom);
              }
            }
          });
      }
    });
  }

  processResult() {
    return (data) => {
      this.itemUoms = data.itemUoms;
    };
  }

  onSave() {
    if (!this.isUploading) {
      this.isUploading = true;
      if (this.itemForm.valid) {
        this.item.itemCode = this.itemForm.value.itemCode;
        this.item.itemName = this.itemForm.value.itemName;
        this.item.price = this.itemForm.value.price;
        this.item.isActive = this.itemForm.value.isActive;
        this.item.isWeighable = this.itemForm.value.isWeighable;
        this.item.isWeightBasedCost = this.itemForm.value.isWeightBasedCost;

        const itemDto = new ItemDto();
        itemDto.item = this.item;

        if (this.item.itemId > 0) {
          this.itemService
            .putItem(itemDto)
            .subscribe(this.processSaveItem(), (err) => {
              this.messageBox('Unable to get a response from the server.');
              this.isUploading = false;
              return;
            });
        } else {
          this.item.itemClass = this.itemForm.value.itemClass;
          this.item.uom = this.itemForm.value.uom;

          if (this.item.itemClass === ItemClass.Stock) {
            itemDto.itemUoms = this.itemUoms;
          } else if (this.item.itemClass === ItemClass.Assembly) {
            itemDto.itemBoms = this.itemBoms;
            itemDto.itemAddOnDetails = this.addOnsService.getItemAddOnDetails();
          } else if (this.item.itemClass === ItemClass.Branded) {
            if (!this.itemGenericForm.valid) {
              this.messageBox('Invalid stock item details.');
              this.isUploading = false;
              return;
            }

            this.itemGeneric.subItem = this.itemGenericForm.value.subItem;
            this.itemGeneric.requiredUom =
              this.itemGenericForm.value.requiredUom;
            this.itemGeneric.requiredQty =
              this.itemGenericForm.value.requiredQty;

            itemDto.itemGeneric = this.itemGeneric;
          }

          this.itemService
            .postItem(itemDto)
            .subscribe(this.processSaveItem(), (err) => {
              this.messageBox('Unable to get a response from the server.');
              this.isUploading = false;
              return;
            });
        }
      } else {
        this.messageBox('Invalid item information.');
        this.isUploading = false;
      }
    }
  }

  processSaveItem() {
    return (itemData) => {
      if (itemData.errorDesc === null) {
        this.itemService.item.next(itemData);
        if (this.item.itemId) {
          this.messageBox('Item details has been updated.');
        } else {
          this.item.itemId = itemData.item.itemId;
          this.itemBoms = itemData.itemBoms;
          this.addOnsService.setItemAddOnDetails(itemData.itemAddOnDetails);
          this.messageBox('Item has been saved successfully.');
        }
      } else {
        if (itemData.errorDesc.includes('item_name')) {
          this.messageBox('Item description already exist.');
        } else if (itemData.errorDesc.includes('item_code')) {
          this.messageBox('Item code already exist.');
        } else {
          this.messageBox(itemData.errorDesc);
        }
      }
      this.isUploading = false;
    };
  }

  onPictureFileChange(event) {
    if (event.target.files[0] !== undefined) {
      this.selectedPicture = event.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event2) => {
        this.displayPicture = reader.result;
        this.displayImg = this.displayPicture;
      };
    }
  }

  onBaseUomChange(baseUom: Uom) {
    this.baseUom = baseUom;
  }

  itemClassChange(itemClass: ItemClass) {
    this.item.itemClass = itemClass;
  }

  onAddItemUom() {
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

          this.itemService.postItemUoms(itemUom).subscribe((res) => {
            this.getItemUoms(this.item.itemId);
            this.messageBox('UoM has been saved.');
            this.itemUomForm.reset();
          });
        } else {
          this.itemUoms = this.itemUoms.concat(itemUom);
          this.itemUomForm.reset();
        }
      }
    } else {
      this.messageBox('Invalid UoM details.');
    }
  }

  onAddItemBom() {
    if (this.itemBomForm.valid) {
      if (isNaN(this.itemBomForm.value.requiredQty)) {
        this.messageBox('Invalid quantity.');
      } else {
        const itemBom = new ItemBom();

        itemBom.subItem = this.itemBomForm.value.subItem;
        itemBom.requiredUom = this.itemBomForm.value.requiredUom;
        itemBom.requiredQty = this.itemBomForm.value.requiredQty;

        if (this.item.itemId > 0) {
          itemBom.mainItem = this.item;

          this.itemService.postItemBoms(itemBom).subscribe((res) => {
            itemBom.itemBomId = res.itemBomId;
            this.itemBoms = this.itemBoms.concat(itemBom);
            this.messageBox('BoM has been saved.');
            this.itemBomForm.reset();
          });
        } else {
          this.itemBoms = this.itemBoms.concat(itemBom);
          this.itemBomForm.reset();
        }
      }
    } else {
      this.messageBox('Invalid BoM details.');
    }
  }

  updateItemGeneric() {
    if (!this.isUploading) {
      this.isUploading = true;

      if (!this.itemGenericForm.valid) {
        this.messageBox('Invalid stock item details.');
        return;
      }

      this.itemGeneric.itemGenericId = this.itemGenericForm.value.itemGenericId;
      this.itemGeneric.subItem = this.itemGenericForm.value.subItem;
      this.itemGeneric.requiredUom = this.itemGenericForm.value.requiredUom;
      this.itemGeneric.requiredQty = this.itemGenericForm.value.requiredQty;

      this.itemService.putItemGenerics(this.itemGeneric).subscribe((res) => {
        this.messageBox('Stock item has been updated.');
        this.isUploading = false;
      });
    }
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

  onDeleteItemBom(itemBom: ItemBom) {
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
                this.itemService
                  .deleteItemBoms(itemBom.itemBomId)
                  .subscribe((res) => {
                    this.messageBox('BoM has been deleted.');
                    for (const key in this.itemBoms) {
                      if (itemBom === this.itemBoms[key]) {
                        this.itemBoms.splice(Number(key), 1);
                      }
                    }
                  });
              } else {
                for (const key in this.itemBoms) {
                  if (itemBom === this.itemBoms[key]) {
                    this.itemBoms.splice(Number(key), 1);
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

  onItemSearch(itemClass?: string) {
    if (!this.modalOpen) {
      this.modalOpen = true;
      this.modalItemSearch
        .create({
          component: ItemSearchComponent,
          cssClass: 'custom-modal-styles',
        })
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

            if (itemClass === 'bom') {
              this.uomsForBom = [uomData];

              this.itemService.getItemUoms(itemData.itemId).subscribe((res) => {
                for (const key in res.itemUoms) {
                  if (res.itemUoms.hasOwnProperty(key)) {
                    this.uomsForBom = this.uomsForBom.concat(
                      res.itemUoms[key].uom
                    );
                  }
                }
              });

              this.itemBomForm.patchValue({
                subItem: itemData,
                subItemName: itemData.itemName,
                requiredUom: uomData,
                requiredQty: 1,
              });

              // const qtyElem = this.quantityInput.getInputElement();
              // qtyElem.then((res) => res.focus());
            } else {
              this.uomsForGeneric = [uomData];

              this.itemService.getItemUoms(itemData.itemId).subscribe((res) => {
                for (const key in res.itemUoms) {
                  if (res.itemUoms.hasOwnProperty(key)) {
                    this.uomsForGeneric = this.uomsForGeneric.concat(
                      res.itemUoms[key].uom
                    );
                  }
                }
              });

              this.itemGenericForm.patchValue({
                subItem: itemData,
                subItemName: itemData.itemName,
                requiredUom: uomData,
                requiredQty: 1,
              });
            }
          }
          this.modalOpen = false;
        });
    }
  }

  onIsWeighableChanged(event) {
    this.isWeightBasedCostOpt.disabled = !event.target.checked;
    if (!this.lockControls) {
      this.isWeightBasedCostOpt.checked = event.target.checked;
    } else {
      this.isWeightBasedCostOpt.disabled = this.lockControls;
      console.log('asdfdewrwer');
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
