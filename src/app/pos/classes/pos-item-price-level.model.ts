import { CustomerGroup } from 'src/app/classes/customer-group.model';
import { PosItemPrice } from './pos-item-price.model';

export class PosItemPriceLevel {
  constructor(
    public posItemPriceLevelId?: number,
    public posItemPrice?: PosItemPrice,
    public customerGroup?: CustomerGroup,
    public price?: number,
  ){}
}
