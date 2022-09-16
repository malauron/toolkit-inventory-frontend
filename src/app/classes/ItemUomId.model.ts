import { Item } from './item.model';
import { Uom } from './uom.model';

export class ItemUomId {
  constructor(
    public item?: Item,
    public uom?: Uom,
  ){}
}
