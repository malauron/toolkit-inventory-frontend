import { Customer } from 'src/app/classes/customer.model';
import { Warehouse } from 'src/app/classes/warehouse.model';
import { ButcheryReleasingItem } from './butchery-releasing-item.model';

export class ButcheryReleasing {
  constructor(
    public butcheryReleasingId?: number,
    public warehouse?: Warehouse,
    public customer?: Customer,
    public releasingStatus?: string,
    public butcheryReleasingItems?: ButcheryReleasingItem[],
    public totalAmount?: number,
    public dateCreated?: string,
  ) {}
}