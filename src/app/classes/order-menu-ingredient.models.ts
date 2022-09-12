import { Item } from './item.model';
import { OrderMenu } from './order-menu.model';
import { Uom } from './uom.model';

export class OrderMenuIngredient {
  constructor(
    public orderMenuIngredientId?: number,
    public orderMenu?: OrderMenu,
    public item?: Item,
    public baseUom?: Uom,
    public baseQty?: number,
    public requiredUom?: Uom,
    public requiredQty?: number,
    public orderedQty?: number,
    public cost?: number,
    public menuIngredientId?: number
  ){}

}
