import { MenuIngredient } from './menu-ingredient.model';
import { Menu } from './menu.model';

export class MenuDto{
  // menu: Menu;
  // menuIngredient: MenuIngredient[];
  constructor(
    public menu?: Menu,
    public menuIngredient?: MenuIngredient[]
  ) { }
}
