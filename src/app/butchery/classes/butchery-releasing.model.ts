import { Customer } from 'src/app/classes/customer.model';
import { Warehouse } from 'src/app/classes/warehouse.model';
import { ButcheryBatch } from './butchery-batch.model';
import { ButcheryReleasingItem } from './butchery-releasing-item.model';

export class ButcheryReleasing {
  constructor(
    public butcheryReleasingId?: number,
    public butcheryBatch?: ButcheryBatch,
    public warehouse?: Warehouse,
    public destinationWarehouse?: Warehouse,
    public customer?: Customer,
    public releasingStatus?: string,
    public butcheryReleasingItems?: ButcheryReleasingItem[],
    public totalAmount?: number,
    public totalWeightKg?: number,
    public dateCreated?: string,
  ) {}
}
