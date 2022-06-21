import { Item } from './item.model';
import { Menu } from './menu.model';
import { Uom } from './uom.model';

export class MenuIngredient{
  constructor(
    public menuIngredientId?: number,
    public menu?: Menu,
    public item?: Item,
    public requiredUom?: Uom,
    public requiredQty?: number
  ) {}
}
