import { Item } from './item.model';
import { Uom } from './uom.model';

export class MenuIngredient{
  constructor(
    public menuIngredientId?: number,
    public menuId?: number,
    public item?: Item,
    public requiredUom?: Uom,
    public requiredQty?: number
  ) {}
}
