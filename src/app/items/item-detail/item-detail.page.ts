/* eslint-disable no-underscore-dangle */
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  AlertController,
  NavController,
  ToastController,
} from '@ionic/angular';
import { Subscription } from 'rxjs';
import { ItemUom } from 'src/app/classes/item-uom.model';
import { Item } from 'src/app/classes/item.model';
import { Uom } from 'src/app/classes/uom.model';
import { ItemsService } from 'src/app/services/items.service';
import { UomsService } from 'src/app/services/uoms.service';

@Component({
  selector: 'app-item-detail',
  templateUrl: './item-detail.page.html',
  styleUrls: ['./item-detail.page.scss'],
})
export class ItemDetailPage implements OnInit {
  pageLabel = 'Item Detail';
  postButton = 'add';
  itemForm: FormGroup;
  itemUomForm: FormGroup;
  item: Item;
  uoms: Uom[] = [];
  itemUoms: ItemUom[] = [];
  uom: Uom;

  private itemSubscription: Subscription;
  private uomSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private itemService: ItemsService,
    private uomService: UomsService,
    private toastController: ToastController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.itemForm = new FormGroup({
      itemName: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(30)],
      }),
      uom: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
    });

    this.itemUomForm = new FormGroup({
      itemUomId: new FormGroup({
        itemId: new FormControl(null, {
          validators: [Validators.required],
        }),
        uomId: new FormControl(null, {
          updateOn: 'blur',
          validators: [Validators.required],
        }),
      }),
      quantity: new FormControl({
        updateOn: 'blur',
        validators: [Validators.required],
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

      // Get item details
      if (this.item.itemId > 0) {
        this.postButton = 'checkmark-outline';
        this.itemSubscription = this.itemService
          .getItem(this.item.itemId)
          .subscribe(
            (itemApiData) => {
              // this.item.uom = itemApiData.uom;
              this.item.itemName = itemApiData.itemName;
              this.item.dateCreated = itemApiData.dateCreated;

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
                      if (itemApiData.uom.uomId === uom.uomId) {
                        this.item.uom = uom;
                      }
                      this.uoms = this.uoms.concat(uom);
                    }
                  }

                  this.itemForm.patchValue({
                    itemName: itemApiData.itemName,
                    uom: this.item.uom,
                  });
                });

              // console.log(this.item.uom);

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
      }
    });
  }

  getItemUoms(itemId: number) {
    this.itemService.getItemUoms(itemId).subscribe(this.processResult());
  }

  processResult() {
    return (data) => {
      this.itemUoms = data._embedded.itemUoms;
    };
  }

  onSave() {
    if (this.itemForm.valid) {
      // this.uom = new Uom();

      this.item.itemName = this.itemForm.value.itemName;
      // this.uom.setUomId = this.itemForm.value.uomId;
      // this.item.uom = this.uom;
      this.item.uom = this.itemForm.value.uom;

      if (this.item.itemId > 0) {
        this.itemService.putItem(this.item).subscribe(this.processSaveItem());
      } else {
        this.itemService.postItem(this.item).subscribe(this.processSaveItem());
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
        this.navCtrl.navigateBack('/tabs/items');
      }
    };
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
    return (postData) => {
      this.getItemUoms(this.item.itemId);
      this.messageBox('UoM has been saved.');
      this.itemUomForm.reset();
    };
  }

  onDeleteItemUom(data: ItemUom) {
    this.alertCtrl
      .create({
        header: 'Confirm',
        message: 'This will be permanently deleted.',
        buttons: [
          {
            text: 'Cancel',
          },
          {
            text: 'Delete',
            handler: () => {
              const itemUomId = data.itemUomId;
              const uom = data.uom;
              const quantity = data.quantity;
              const itemUom = new ItemUom(itemUomId, quantity, uom);
              this.itemService.deleteItemUoms(itemUom).subscribe((res) => {
                this.messageBox('Unit of measure has been deleted.');
                this.getItemUoms(this.item.itemId);
              });
            },
          },
        ],
      })
      .then((res) => {
        res.present();
      });
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
