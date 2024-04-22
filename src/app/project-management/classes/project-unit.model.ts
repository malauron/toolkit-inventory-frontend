import { ProjectContract } from './project-contract.model';
import { Project } from './project.model';
import { UnitStatus } from './unit-status.model';

export class ProjectUnit {
  constructor(
    public unitId?: number,
    public unitCode?: string,
    public unitDescription?: string,
    public unitPrice?: number,
    public reservationAmt?: number,
    public project?: Project,
    public unitClass?: string,
    public unitStatus?: UnitStatus,
    public currentContract?: ProjectContract,
    public dateCreated?: string,
    public dateUpdated?: string,
    public version?: number,
  ) {}
}
