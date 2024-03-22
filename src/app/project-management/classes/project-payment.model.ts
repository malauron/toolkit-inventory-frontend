import { User } from "src/app/Security/classes/user.model";
import { ProjectClient } from "./project-client.model";

export class ProjectPayment {
  constructor(
    public paymentId?: number,
    public client?: ProjectClient,
    public ttlAmtPaid?: number,
    public referenceNo?: string,
    public dateReceived?: string,
    public remarks?: string,
    public createdBy?: User,
    public dateCreated?: string,
    public dateUpdated?: string,
  ){}
}
