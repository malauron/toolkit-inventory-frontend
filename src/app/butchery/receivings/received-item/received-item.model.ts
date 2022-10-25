import { Item } from 'src/app/classes/item.model';
import { Uom } from 'src/app/classes/uom.model';

export class ReceivedItemDetail{
  constructor(
    public item?: Item,
    public itemCode?: string,
    public uom?: Uom,
    public receivedQty?: number,
    public itemCost?: number,
    public documentedWeight?: number,
    public actualWeight?: number,
  ){}
}