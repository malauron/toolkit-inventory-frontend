import { Item } from 'src/app/classes/item.model';
import { Uom } from 'src/app/classes/uom.model';
import { ButcheryReceiving } from './butchery-receiving.model';

export class ButcheryReceivingItem {
  constructor(
    public butcheryReceivingItemId?: number,
    public butcheryReceiving?: ButcheryReceiving,
    public item?: Item,
    public barcode?: string,
    public itemClass?: string,
    public baseUom?: Uom,
    public baseQty?: number,
    public requiredUom?: Uom,
    public documentedQty?: number,
    public receivedQty?: number,
    public documentedWeightKg?: number,
    public receivedWeightKg?: number,
    public itemCost?: number,
    public totalAmount?: number,
    public usedQty?: number,
    public remarks?: string,
    public isAvailable?: boolean,
  ){}
}
