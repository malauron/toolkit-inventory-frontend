/* eslint-disable no-underscore-dangle */
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { ItemUom } from 'src/app/classes/item-uom';
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
  itemId: number;
  dateCreated: string;
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
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.itemForm = new FormGroup({
      itemName: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(30)],
      }),
      uomId: new FormControl(null, {
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

      this.itemId = Number(paramMap.get('itemId'));

      // Assign the item id to each
      // new item uom
      this.itemUomForm.patchValue({
        itemUomId: {
          itemId: this.itemId,
        },
      });

      // Fecth all uoms for this item
      this.getItemUoms(this.itemId);

      if (this.itemId > 0) {
        this.postButton = 'checkmark-outline';
        this.itemSubscription = this.itemService.getItem(this.itemId).subscribe(
          (itemApiData) => {
            this.dateCreated = itemApiData.dateCreated;

            this.itemForm.patchValue({
              itemName: itemApiData.itemName,
              uomId: itemApiData.uom.uomId.toString(),
            });
          },
          (error) => {
            console.log('An error has occured:' + error);
          }
        );
      } else {
        this.pageLabel = 'New Item';
      }

      this.uomSubscription = this.uomService
        .findAllUoms()
        .subscribe((uomApiData) => {
          this.uoms = uomApiData._embedded.uoms;
        });
    });
  }

  getItemUoms(itemId: number) {
    this.itemService.getItemUoms(itemId).subscribe(
      this.processResult()
    );
  }

  processResult() {
    return (data) => {
      this.itemUoms = data._embedded.itemUoms;
    };
  }

  onSave() {
    if (this.itemForm.valid) {
      this.item = new Item();
      this.uom = new Uom();

      this.item.setItemName = this.itemForm.value.itemName;
      this.uom.setUomId = this.itemForm.value.uomId;
      this.item.uom = this.uom;

      if (this.itemId > 0) {
        this.item.itemId = this.itemId;
        this.item.setDateCreated = this.dateCreated;
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
      if (this.itemId) {
        this.messageBox('Item details has been updated.');
      } else {
        this.navCtrl.back();
      }
    };
  }

  onSaveUom() {
    if (this.itemUomForm.valid) {
      this.itemService
        .postItemUoms(this.itemUomForm.value)
        .subscribe(this.processSaveUom());
    } else {
      this.messageBox('Invalid UoM details.');
    }
  }

  processSaveUom() {
    return (postData) => {
      this.getItemUoms(this.itemId);
      this.messageBox('UoM has been saved.');
    };
  }

  onDeleteItemUom(data: ItemUom) {
    const itemUomId = data.itemUomId;
    const uom = data.uom;
    const quantity = data.quantity;
    const itemUom = new ItemUom(itemUomId,quantity,uom);
    this.itemService.deleteItemUoms(itemUom).subscribe(
      res => {
        console.log(res);
        this.getItemUoms(this.itemId);
      }
    );
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
