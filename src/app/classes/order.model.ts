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

  ) {
    this.setParams();
  }

  setParams() {
    this.orderId = 0;
    this.customer = undefined;
    this.totalPrice = 0;
    this.orderStatus = '';
    this.orderMenus = undefined;
    this.dateCreated = '';
    this.dateUpdated = '';
  }

}
