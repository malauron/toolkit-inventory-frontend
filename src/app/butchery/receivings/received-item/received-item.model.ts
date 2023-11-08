import { Item } from 'src/app/classes/item.model';
import { Uom } from 'src/app/classes/uom.model';

export class ReceivedItemDetail{
  constructor(
    public item?: Item,
    public itemCode?: string,
    public uom?: Uom,
    public documentedQty?: number,
    public receivedQty?: number,
    public documentedWeightKg?: number,
    public receivedWeightKg?: number,
    public usedQty?: number,
    public remarks?: string,
    public isAvailable?: boolean,
  ){}
}
