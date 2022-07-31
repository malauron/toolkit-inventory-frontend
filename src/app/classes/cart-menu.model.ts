import { CartMenuIngredient } from './cart-menu-ingredient.model';
import { Menu } from './menu.model';

export class CartMenu {
  constructor(
    public cartMenuId?: number,
    public menu?: Menu,
    public orderQty?: number,
    public price?: number,
    public lineTotal?: number,
    public cartMenuIngredients?: CartMenuIngredient[]
  ) {}
}
