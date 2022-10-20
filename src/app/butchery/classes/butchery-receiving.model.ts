import { Customer } from 'src/app/classes/customer.model';
import { Vendor } from 'src/app/classes/vendor.model';
import { Warehouse } from 'src/app/classes/warehouse.model';
import { ButcheryReceivingItem } from './butchery-receiving-item.model';

export class ButcheryReceiving {
  constructor(
    public butcheryReceivingId?: number,
    public warehouse?: Warehouse,
    public vendor?: Vendor,
    public referenceCode?: string,
    public receivingStatus?: string,
    public butcheryReceivingItems?: ButcheryReceivingItem[],
    public totalAmount?: number,
    public dateCreated?: string,
  ) {}
}
