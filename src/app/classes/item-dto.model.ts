import { ItemUom } from './item-uom.model';
import { Item } from './item.model';

export class ItemDto {
  constructor(
  public item?: Item,
  public itemUoms?: ItemUom[],
  ){}
}
