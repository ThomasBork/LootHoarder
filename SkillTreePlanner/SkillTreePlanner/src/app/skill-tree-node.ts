export class SkillTreeNode {
  public x: number;
  public y: number;
  public typeKey: string;
  public data: any;
  public constructor(
    x: number,
    y: number,
    typeKey: string,
    data: any,
  ) {
    this.x = x;
    this.y = y;
    this.typeKey = typeKey;
    this.data = data;
  }

  public getDataAsJson(): string {
    return JSON.stringify(this.data, null, 2);
  }
}
