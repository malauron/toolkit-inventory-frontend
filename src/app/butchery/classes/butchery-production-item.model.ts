import { Item } from 'src/app/classes/item.model';
import { Uom } from 'src/app/classes/uom.model';
import { ButcheryProduction } from './butchery-production.model';

export class ButcheryProductionItem {
  constructor(
    public butcheryProductionItemId?: number,
    public butcheryProduction?: ButcheryProduction,
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
