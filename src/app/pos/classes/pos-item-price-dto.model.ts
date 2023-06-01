import { Item } from 'src/app/classes/item.model';
import { Warehouse } from 'src/app/classes/warehouse.model';
import { PosItemPriceLevel } from './pos-item-price-level.model';

export class PosItemPriceDto {
  constructor(
    public posItemPriceId?: number,
    public posItemPriceLevels?: PosItemPriceLevel[],
    public warehouse?: Warehouse,
    public item?: Item,
    public defaultPrice?: number,
    public errorMsg?: string,
  ){}
}
