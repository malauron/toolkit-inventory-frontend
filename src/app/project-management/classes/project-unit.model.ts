import { Project } from "./project.model";
import { UnitClass } from "./unit-class.model";

export class ProjectUnit {
  constructor(
    public unitId?: number,
    public unitCode?: string,
    public unitDescription?: string,
    public unitPirce?: number,
    public project?: Project,
    public unitClass?: UnitClass,
    public dateCreated?: string,
    public dateUpdated?: string,
  ){}
}
