import { Customer } from './customer.model';

export class Order {
  constructor(
    public orderId?: number,
    public customer?: Customer,
    public totalPrice?: number,
    public dateCreated?: string,
  ) {}
}
