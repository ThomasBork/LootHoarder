import { ContractAttributeType } from "src/loot-hoarder-contract/contract-attribute-type";
import { ItemAbilityParameters } from "./item-ability-parameters";

export class ItemAbilityParametersAttribute extends ItemAbilityParameters {
  public isAdditive: boolean;
  public attributeType: ContractAttributeType;
  public abilityTag?: string;
  public amount: number;
  public constructor(
    isAdditive: boolean,
    attributeType: ContractAttributeType,
    abilityTag: string | undefined,
    amount: number,
  ) {
    super();
    this.isAdditive = isAdditive;
    this.attributeType = attributeType;
    this.abilityTag = abilityTag;
    this.amount = amount;
  }
}