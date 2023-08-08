import { Item } from 'src/app/classes/item.model';
import { Uom } from 'src/app/classes/uom.model';
import { ButcheryProduction } from './butchery-production.model';
import { ButcheryReceivingItem } from './butchery-receiving-item.model';

export class ButcheryProductionSource {
  constructor(
    public butcheryProductionSourceId?: number,
    public butcheryProduction?: ButcheryProduction,
    public item?: Item,
    public baseUom?: Uom,
    public baseQty?: number,
    public requiredUom?: Uom,
    public requiredQty?: number,
    public requiredWeightKg?: number,
  ) {}
}
