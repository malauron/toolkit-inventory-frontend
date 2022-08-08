import { Menu } from './menu.model';
import { OrderMenuIngredient } from './order-menu-ingredient.models';

export class OrderMenuDto {
  constructor(
    public orderMenuId?: number,
    public menu?: Menu,
    public orderQty?: number,
    public price?: number,
    public lineTotal?: number,
    public orderMenuIngredients?: OrderMenuIngredient[]
  ){}
}
