import { CartMenu } from './cart-menu.model';
import { Uom } from './uom.model';

export class CartMenuIngredient {
  constructor(
    public cartMenuIngredientId?: number,
    public cartMenu?: CartMenu,
    public baseUom?: Uom,
    public baseQty?: number,
    public requiredUom?: Uom,
    public requiredQty?: number,
    public orderedQty?: number
  ) {}
}
