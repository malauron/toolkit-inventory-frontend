import { Customer } from './customer.model';

export class CustomerSignature {
  constructor(
    public customerSignatureId?: number,
    public customer?: Customer,
    public file?: any,
    public type?: string
  ){}
}
