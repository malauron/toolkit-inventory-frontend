import { ItemAddOnDetail } from '../items/item-add-ons/classes/item-add-on-detail.model';
import { ItemBom } from './item-bom.model';
import { ItemGeneric } from './item-generic.model';
import { ItemUom } from './item-uom.model';
import { Item } from './item.model';

export class ItemDto {
  constructor(
  public item?: Item,
  public itemUoms?: ItemUom[],
  public itemBoms?: ItemBom[],
  public itemGeneric?: ItemGeneric,
  public itemAddOnDetails?: ItemAddOnDetail[],
  public errorDesc?: string,
  ){}
}
