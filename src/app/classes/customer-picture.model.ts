import { Customer } from './customer.model';

export class CustomerPicture {
  constructor(
    public customerPictureId?: number,
    public customer?: Customer,
    public file?: any,
    public type?: string
  ){}
}
