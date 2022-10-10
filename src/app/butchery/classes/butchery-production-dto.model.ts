import { Warehouse } from 'src/app/classes/warehouse.model';
import { ButcheryProductionItem } from './butchery-production-item.model';

export class ButcheryProductionDto {
  constructor(
    public butcheryProductionId?: number,
    public totalWeight?: number,
    public productionStatus?: string,
    public warehouse?: Warehouse,
    public butcheryProductionItems?: ButcheryProductionItem[],
    public dateCreated?: string,
  ) {}
}
