import { CartMenu } from './cart-menu.model';
import { Customer } from './customer.model';
import { OrderMenu } from './order-menu.model';
import { Warehouse } from './warehouse.model';

export class OrderDto{
  constructor(
    public orderId?: number,
    public warehouse?: Warehouse,
    public orderStatus?: string,
    public customer?: Customer,
    public orderMenus?: OrderMenu[],
    public cartMenus?: CartMenu[]
  ){}
}
