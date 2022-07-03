import { CartMenuIngredient } from './cart-menu-ingredient.model';
import { CartMenu } from './cart-menu.model';

export class CartMenuDto {
  constructor(
    public cartMenu?: CartMenu,
    public cartMenuIngredients?: CartMenuIngredient[]
  ) {}
}
