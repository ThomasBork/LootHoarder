import { ContractAttributeType } from "src/loot-hoarder-contract/contract-attribute-type";

export class Attribute {
  public type: ContractAttributeType;
  public tag?: string;
  public additiveValue: number;
  public multiplicativeValue: number;
  public value: number;

  public constructor(
    type: ContractAttributeType,
    tag: string | undefined,
    additiveValue: number,
    multiplicativeValue: number,
    value: number
  ) {
    this.type = type;
    this.tag = tag;
    this.additiveValue = additiveValue;
    this.multiplicativeValue = multiplicativeValue;
    this.value = value;
  }
}