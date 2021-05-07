export class ItemAbilityType {
  public key: string;
  public parameters: string[];
  public constructor(
    key: string,
    parameters: string[]
  ) {
    this.key = key;
    this.parameters = parameters;
  }
}