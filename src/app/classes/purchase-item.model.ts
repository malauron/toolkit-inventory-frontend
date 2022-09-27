import { Item } from './item.model';
import { Purchase } from './purchase.model';
import { Uom } from './uom.model';

export class PurchaseItem {
  constructor(
    public purchaseItemId?: number,
    public purchase?: Purchase,
    public item?: Item,
    public itemClass?: string,
    public baseUom?: Uom,
    public baseQty?: number,
    public requiredUom?: Uom,
    public purchasedQty?: number,
    public purchasePrice?: number,
    public totalAmount?: number,
  ){}
}
