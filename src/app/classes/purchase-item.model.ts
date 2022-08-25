import { Item } from './item.model';
import { Purchase } from './purchase.model';
import { Uom } from './uom.model';

export class PurchaseItem {
  constructor(
    public purchaseItemId?: number,
    public purchase?: Purchase,
    public item?: Item,
    public baseUom?: Uom,
    public baseQty?: number,
    public requiredUom?: Uom,
    public purchasedQty?: number,
    public cost?: number,
  ){}
}
