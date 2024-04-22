import { ProjectContract } from './project-contract.model';
import { Project } from './project.model';
import { UnitStatus } from './unit-status.model';

export class ProjectUnitDto {
  constructor(
    public unitId?: number,
    public unitCode?: string,
    public unitDescription?: string,
    public unitPrice?: number,
    public reservationAmt?: number,
    public unitClass?: string,
    public unitStatus?: UnitStatus,
    public currentContract?: ProjectContract,
    public project?: Project,
    public version?: number,
    public errorCode?: string,
    public errorDescriptoin?: string
  ) {}
}
