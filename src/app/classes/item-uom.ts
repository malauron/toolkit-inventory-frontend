import { Uom } from './uom.model';

interface ItemUomId {
  itemId: number;
  uomId: number;
}

export class ItemUom {

  constructor(
    public itemUomId: ItemUomId,
    public quantity: number,
    public uom?: Uom) {}

  // set itemId(itemId) {
  //   this.itemUomId.itemId = itemId;
  // }

  // set uomId(uomId) {
  //   this.itemUomId.uomId = uomId;
  // }
}
