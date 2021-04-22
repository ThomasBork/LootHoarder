export class AreaType {
  public key: string;
  public name: string;
  public description: string;
  public level: number;
  public adjacentAreaTypes: AreaType[] = [];

  public constructor(
    key: string,
    name: string,
    description: string,
    level: number
  ) {
    this.key = key;
    this.name = name;
    this.description = description;
    this.level = level;
  }
}
