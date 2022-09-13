import { CustomerPicture } from './customer-picture.model';
import { CustomerSignature } from './customer-signature.model';

export class Customer {
  constructor(
    public customerId?: number,
    public customerCode?: string,
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
    public customerPicture?: CustomerPicture,
    public customerSignature?: CustomerSignature,
    public convertedPicture?: any,
    public convertedSignature?: any,
  ){}
}
