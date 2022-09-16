import { Item } from './item.model';
import { ItemUomId } from './ItemUomId.model';
import { Uom } from './uom.model';

// interface ItemUomId {
//   item: Item;
//   uom: Uom;
// }

export class ItemUom {

  constructor(
    public itemUomId?: ItemUomId,
    public quantity?: number) {}

}
