import { Customer } from 'src/app/classes/customer.model';
import { Warehouse } from 'src/app/classes/warehouse.model';
import { PosSaleItem } from './pos-sale-item.model';

export class PosSaleDto {
  constructor(
    public posSaleId?: number,
    public saleStatus?: string,
    public warehouse?: Warehouse,
    public customer?: Customer,
    public posSaleItems?: PosSaleItem[],
    public posSaleItem?: PosSaleItem,
    public totalAmount?: number,
    public dateCreated?: string,
    public errorDescription?: string,
  ) {}
}
