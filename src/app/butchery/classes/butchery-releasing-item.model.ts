import { Item } from 'src/app/classes/item.model';
import { Uom } from 'src/app/classes/uom.model';
import { ButcheryReleasing } from './butchery-releasing.model';

export class ButcheryReleasingItem {
  constructor(
    public butcheryReleasingItemId?: number,
    public butcheryReleasing?: ButcheryReleasing,
    public item?: Item,
    public barcode?: string,
    public itemClass?: string,
    public baseUom?: Uom,
    public baseQty?: number,
    public requiredUom?: Uom,
    public producedQty?: number,
    public productionCost?: number,
    public totalAmount?: number,
  ){}
}
