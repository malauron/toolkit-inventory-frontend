import { Item } from 'src/app/classes/item.model';
import { Uom } from 'src/app/classes/uom.model';
import { ButcheryReleasing } from './butchery-releasing.model';

export class ButcheryReleasingItemPrint {
  constructor(
    public butcheryReleasingItemId?: number,
    public item?: Item,
    public barcode?: string,
    public itemClass?: string,
    public baseUom?: Uom,
    public baseQty?: number,
    public cost?: number,
    public requiredUom?: Uom,
    public releasedQty?: number,
    public itemPrice?: number,
    public totalAmount?: number,
    public isSubTotal?: boolean,
    public runningEntries?: number,
    public runningItemQty?: number,
    public totalUom?: Uom,
  ){}
}
