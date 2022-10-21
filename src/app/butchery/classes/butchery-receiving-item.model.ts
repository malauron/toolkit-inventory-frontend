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
    public receivedQty?: number,
    public itemCost?: number,
    public totalAmount?: number,
    public documentedWeight?: number,
    public actualWeight?: number,
  ){}
}
