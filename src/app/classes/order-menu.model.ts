import { Menu } from './menu.model';
import { OrderMenuIngredient } from './order-menu-ingredient.models';
import { Order } from './order.model';

export class OrderMenu {
  constructor(
    public orderMenuId?: number,
    public order?: Order,
    public menu?: Menu,
    public orderQty?: number,
    public price?: number,
    public lineTotal?: number,
    public orderMenuIngredients?: OrderMenuIngredient[]
  ){}
}
