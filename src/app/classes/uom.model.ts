export class Uom {
  // uomId: number;
  // uomCode: string;
  // uomName: string;

  constructor(
    public uomId?: number,
    public uomCode?: string,
    public uomName?: string
  ) {}

  set setUomId(uomId: number) {
    this.uomId = uomId;
  }
}
