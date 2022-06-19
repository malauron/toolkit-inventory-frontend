import { MenuIngredient } from './menu-ingredient.model';

export class Menu {
  constructor(
    public menuId?: number,
    public menuName?: string,
    public price?: number,
    public dateCreated?: string,
    public menuIngredient?: MenuIngredient[]
  ) {}
}
