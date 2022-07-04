import { CartMenu } from './cart-menu.model';
import { Item } from './item.model';
import { Uom } from './uom.model';

export class CartMenuIngredient {
  constructor(
    public cartMenuIngredientId?: number,
    public cartMenu?: CartMenu,
    public item?: Item,
    public baseUom?: Uom,
    public baseQty?: number,
    public requiredUom?: Uom,
    public requiredQty?: number,
    public orderedQty?: number
  ) {}
}
