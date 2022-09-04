import { CustomerPicture } from './customer-picture.model';
import { Customer } from './customer.model';

export class CustomerDto {
  constructor(
    public customer?: Customer,
    public customerPicture?: CustomerPicture,
    public origCustomerPicture?: FormData
  ){}
}
