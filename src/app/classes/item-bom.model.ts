import { Item } from './item.model';
import { Uom } from './uom.model';

export class ItemBom {
  constructor(
    public itemBomId?: number,
    public mainItem?: Item,
    public subItem?: Item,
    public requiredUom?: Uom,
    public requiredQty?: number,
  ) {}
}
