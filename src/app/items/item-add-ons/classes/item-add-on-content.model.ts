import { Item } from 'src/app/classes/item.model';
import { Uom } from 'src/app/classes/uom.model';

export class ItemAddOnContent {
  constructor(
    public itemAddOnId?: number,
    public item?: Item,
    public uom?: Uom,
    public qty?: number,
    public price?: number,
    public altDesc?: string
  ){}
}
