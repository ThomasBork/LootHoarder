export class AbilityType {
  public key: string;
  public name: string;
  public description: string;
  public tags: string[];

  public constructor(
    key: string,
    name: string,
    description: string,
    tags: string[]
  ) {
    this.key = key;
    this.name = name;
    this.description = description;
    this.tags = tags;
  }
}