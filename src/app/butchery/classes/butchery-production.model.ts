import { Warehouse } from 'src/app/classes/warehouse.model';
import { ButcheryProductionItem } from './butchery-production-item.model';

export class ButcheryProduction {
  constructor(
    public butcheryProductionId?: number,
    public warehouse?: Warehouse,
    public productionStatus?: string,
    public butcheryProductionItems?: ButcheryProductionItem[],
    public totalAmount?: number,
    public dateCreated?: string,
  ) {}
}
