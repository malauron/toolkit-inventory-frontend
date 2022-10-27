import { ButcheryProduction } from './butchery-production.model';
import { ButcheryReceivingItem } from './butchery-receiving-item.model';

export class ButcheryProductionSource {
  constructor(
    public butcheryProductionSourceId?: number,
    public butcheryProduction?: ButcheryProduction,
    public requiredQty?: number,
    public butcheryReceivingItem?: ButcheryReceivingItem
  ) {}
}
