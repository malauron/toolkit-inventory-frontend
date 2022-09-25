import { Item } from './item.model';
import { Uom } from './uom.model';

export class ItemGeneric {
  constructor(
    public itemGenericId?: number,
    public mainItem?: Item,
    public subItem?: Item,
    public requiredUom?: Uom,
    public requiredQty?: number
  ) {}
}
