export class AreaType {
  public key: string;
  public name: string;
  public description: string;
  public level: number;
  public adjacentAreaTypes: AreaType[] = [];
  public x: number;
  public y: number;

  public constructor(
    key: string,
    name: string,
    description: string,
    level: number,
    x: number,
    y: number,
  ) {
    this.key = key;
    this.name = name;
    this.description = description;
    this.level = level;
    this.x = x;
    this.y = y;
  }
}
