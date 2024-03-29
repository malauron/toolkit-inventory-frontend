import { Warehouse } from 'src/app/classes/warehouse.model';
import { ButcheryBatch } from './butchery-batch.model';
import { ButcheryProductionItem } from './butchery-production-item.model';
import { ButcheryProductionSource } from './butchery-production-source.model';
import { ButcheryProduction } from './butchery-production.model';

export class ButcheryProductionDto {
  constructor(
    public butcheryProductionId?: number,
    public productionStatus?: string,
    public warehouse?: Warehouse,
    public butcheryProductionItems?: ButcheryProductionItem[],
    public butcheryProductionItem?: ButcheryProductionItem,
    public butcheryProductionSources?: ButcheryProductionSource[],
    public butcheryProductionSource?: ButcheryProductionSource,
    public butcheryProductionSourceViews?: ButcheryProductionSource[],
    public butcheryProductionSourceView?: ButcheryProductionSource,
    public butcheryProductionSourceShortViews?: ButcheryProductionSource[],
    public totalProducedWeightKg?: number,
    public dateCreated?: string,
  ) {}
}
