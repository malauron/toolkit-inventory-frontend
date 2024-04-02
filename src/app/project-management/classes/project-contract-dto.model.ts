import { ProjectBroker } from "./project-broker.model";
import { ProjectBrokerage } from "./project-brokerage.model";
import { ProjectClient } from "./project-client.model";
import { ProjectUnit } from "./project-unit.model";

export class ProjectContract {
  constructor(
    public contractId?: number,
    public client?: ProjectClient,
    public brokerage?: ProjectBrokerage,
    public broker?: ProjectBroker,
    public unit?: ProjectUnit,
    public reservationAmt?: number,
    public unitPrice?: number,
    public equityAmt?: number,
    public equityPct?: number,
    public ttlEquityPaid?: number,
    public equityBalance?: number,
    public financingAmt?: number,
    public financingPct?: number,
    public ttlFinancingPaid?: number,
    public financingBalance?: number,
    public ttlPayment?: number,
    public ttlBalance?: number,
    public remarks?: number,
    public isCancelled?: number,
    public dateCreated?: number,
    public dateUpdated?: number,
    public version?: number
  ){}
}
