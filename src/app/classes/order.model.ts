import { Customer } from './customer.model';
import { OrderMenu } from './order-menu.model';

export class Order {
  constructor(
    public orderId?: number,
    public customer?: Customer,
    public totalPrice?: number,
    public orderStatus?: string,
    public orderMenus?: OrderMenu[],
    public dateCreated?: string,
    public dateUpdated?: string,

  ) {}
}
