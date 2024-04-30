import { ProjectContract } from "./project-contract.model";

export class ProjectContractEquitySchedule {
  constructor(
    public scheduleId?: number,
    public contract?: ProjectContract,
    public payableEquity?: number,
    public equityPaid?: number,
    public dueDate?: string,
  ){}
}
