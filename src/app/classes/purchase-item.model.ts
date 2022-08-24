import { Item } from './item.model';
import { Uom } from './uom.model';

export class PurchaseItem {
  constructor(
    public purchaseItemId?: number,
    public item?: Item,
    public requiredUom?: Uom,
    public requiredQty?: number,
    public cost?: number,
  ){}
}
