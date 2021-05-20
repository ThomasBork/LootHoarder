import { ContractAttributeType } from "src/loot-hoarder-contract/contract-attribute-type";
import { ItemAbilityParameters } from "./item-ability-parameters";

export class ItemAbilityParametersAttribute extends ItemAbilityParameters {
  public isAdditive: boolean;
  public attributeType: ContractAttributeType;
  public abilityTags: string[];
  public amount: number;
  public constructor(
    isAdditive: boolean,
    attributeType: ContractAttributeType,
    abilityTags: string[],
    amount: number,
  ) {
    super();
    this.isAdditive = isAdditive;
    this.attributeType = attributeType;
    this.abilityTags = abilityTags;
    this.amount = amount;
  }
}