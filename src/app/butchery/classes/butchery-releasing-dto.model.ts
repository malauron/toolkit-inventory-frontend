import { Customer } from 'src/app/classes/customer.model';
import { Warehouse } from 'src/app/classes/warehouse.model';
import { ButcheryReleasingItem } from './butchery-releasing-item.model';

export class ButcheryReleasingDto {
  constructor(
    public butcheryReleasingId?: number,
    public releasingStatus?: string,
    public warehouse?: Warehouse,
    public destinationWarehouse?: Warehouse,
    public customer?: Customer,
    public butcheryReleasingItems?: ButcheryReleasingItem[],
    public butcheryReleasingItem?: ButcheryReleasingItem,
    public totalAmount?: number,
    public dateCreated?: string,
    public errorDescription?: string,
  ) {}
}
