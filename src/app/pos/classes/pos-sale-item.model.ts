import { Item } from 'src/app/classes/item.model';
import { Uom } from 'src/app/classes/uom.model';
import { PosSale } from './pos-sale.model';

export class PosSaleItem {
  constructor(
    public posSaleItemId?: number,
    public posSale?: PosSale,
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
  ){}
}
