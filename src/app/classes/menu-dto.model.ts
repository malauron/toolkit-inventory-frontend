import { CartMenuIngredient } from './cart-menu-ingredient.model';
import { CartMenu } from './cart-menu.model';
import { MenuIngredient } from './menu-ingredient.model';
import { Menu } from './menu.model';

export class MenuDto{
  constructor(
    public cartMenu?: CartMenu,
    public cartMenuIngredients?: CartMenuIngredient[]
  ) { }
}
