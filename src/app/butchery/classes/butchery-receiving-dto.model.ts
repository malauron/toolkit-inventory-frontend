import { VendorWarehouse } from 'src/app/classes/vendor-warehouse.model';
import { Warehouse } from 'src/app/classes/warehouse.model';
import { ButcheryReceivingItem } from './butchery-receiving-item.model';

export class ButcheryReceivingDto {
  constructor(
    public butcheryReceivingId?: number,
    public receivingStatus?: string,
    public warehouse?: Warehouse,
    public vendorWarehouse?: VendorWarehouse,
    public referenceCode?: string,
    public butcheryReceivingItems?: ButcheryReceivingItem[],
    public butcheryReceivingItem?: ButcheryReceivingItem,
    public totalAmount?: number,
    public dateCreated?: string,
    public errorDescription?: string,
  ) {}
}
