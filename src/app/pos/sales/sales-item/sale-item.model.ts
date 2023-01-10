import { Item } from 'src/app/classes/item.model';
import { Uom } from 'src/app/classes/uom.model';

export class SaleItemDetail {
  constructor(
    public item?: Item,
    public uom?: Uom,
    public quantity?: number,
    public price?: number,
  ){}
}
