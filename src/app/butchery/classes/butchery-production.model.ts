import { Warehouse } from 'src/app/classes/warehouse.model';
import { ButcheryProductionItem } from './butchery-production-item.model';
import { ButcheryProductionSource } from './butchery-production-source.model';

export class ButcheryProduction {
  constructor(
    public butcheryProductionId?: number,
    public warehouse?: Warehouse,
    public productionStatus?: string,
    public butcheryProductionItems?: ButcheryProductionItem[],
    public butcheryProductionSources?: ButcheryProductionSource[],
    public butcheryProductionSourceViews?: ButcheryProductionSource[],
    public totalProducedWeightKg?: number,
    public dateCreated?: string,
  ) {}
}
