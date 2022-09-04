import { CustomerPicture } from './customer-picture.model';

export class Customer {
  constructor(
    public customerId?: number,
    public customerName?: string,
    public contactNo?: string,
    public address?: string,
    public bloodType?: string,
    public sssNo?: string,
    public hdmfNo?: string,
    public phicNo?: string,
    public tinNo?: string,
    public erContactPerson?: string,
    public erContactNo?: string,
    public erContactAddress?: string,
    public customerPicture?: CustomerPicture
  ){}
}
