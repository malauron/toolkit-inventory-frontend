import { Item } from 'src/app/classes/item.model';
import { Uom } from 'src/app/classes/uom.model';

export class PurchaseItemDetail{
  constructor(
    public item?: Item,
    public uom?: Uom,
    public quantity?: number,
    public cost?: number,
  ){}
}
