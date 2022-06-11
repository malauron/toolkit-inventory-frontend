import { Uom } from './uom.model';

export class Item {

  itemId: number;
  itemName: string;
  uom: Uom;
  dateCreated: string;

  constructor() {}

  set setItemId(itemId: number) {
    this.itemId = itemId;
  }

  set setItemName(itemName: string) {
    this.itemName = itemName;
  }

  set setUom(uom: Uom) {
    this.uom = uom;
  }

  set setDateCreated(dateCreated: string) {
    this.dateCreated = dateCreated;
  }

}
