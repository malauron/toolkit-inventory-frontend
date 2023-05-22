import { CustomerGroup } from 'src/app/classes/customer-group.model';

export class TempPosItemPriceLevel {
  constructor(
    public lineNo?: number,
    public description?: string,
    public posItemPriceLevelId?: number,
    public customerGroup?: CustomerGroup,
    public price?: number,
  ){}
}
