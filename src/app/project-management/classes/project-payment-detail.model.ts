import { ProjectContract } from "./project-contract.model";
import { ProjectPayment } from "./project-payment.model";

export class ProjectPaymentDetail {
  constructor(
    public paymentDetailId?: number,
    public payment?: ProjectPayment,
    public contract?: ProjectContract,
    public reservation?: number,
    public equity?: number,
    public financing?: number,
    public others?: number,
    public ttlAmtPaid?: number,
  ){}
}
