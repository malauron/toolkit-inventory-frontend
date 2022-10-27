import { Warehouse } from 'src/app/classes/warehouse.model';
import { ButcheryProductionItem } from './butchery-production-item.model';
import { ButcheryProductionSource } from './butchery-production-source.model';

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
    public totalAmount?: number,
    public dateCreated?: string,
  ) {}
}
