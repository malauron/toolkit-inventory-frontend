import { ProjectContract } from "./project-contract.model";
import { Project } from "./project.model";
import { UnitClass } from "./unit-class.model";
import { UnitStatus } from "./unit-status.model";

export class ProjectUnitDto {
  constructor(
    public unitId?: number,
    public unitCode?: string,
    public unitDescription?: string,
    public unitPrice?: number,
    public unitClass?: UnitClass,
    public unitStatus?: UnitStatus,
    public currentContract?: ProjectContract,
  ){}
}
