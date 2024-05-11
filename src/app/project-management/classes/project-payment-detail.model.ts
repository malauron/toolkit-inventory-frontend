import { ProjectContract } from "./project-contract.model";
import { ProjectPayment } from "./project-payment.model";

export class ProjectPaymentDetail {
  constructor(
    public paymentDetailId?: number,
    public payment?: ProjectPayment,
    public contract?: ProjectContract,
    public reservationPaid?: number,
    public equityPaid?: number,
    public financingPaid?: number,
    public others?: number,
    public ttlAmtPaid?: number,
  ){}
}
