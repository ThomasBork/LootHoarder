import { ContractAttributeType } from "src/loot-hoarder-contract/contract-attribute-type";

export class Attribute {
  public type: ContractAttributeType;
  public tags: string[];
  public additiveValue: number;
  public multiplicativeValue: number;
  public value: number;

  public constructor(
    type: ContractAttributeType,
    tags: string[],
    additiveValue: number,
    multiplicativeValue: number,
    value: number
  ) {
    this.type = type;
    this.tags = tags;
    this.additiveValue = additiveValue;
    this.multiplicativeValue = multiplicativeValue;
    this.value = value;
  }
}