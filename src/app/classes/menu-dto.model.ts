import { MenuIngredient } from './menu-ingredient.model';
import { Menu } from './menu.model';

export class MenuDto{
  constructor(
    public menu?: Menu,
    public menuIngredients?: MenuIngredient[]
  ) { }
}
