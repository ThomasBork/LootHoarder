import { AbilityTagTranslator } from "src/app/shared/ability-tag-translator";
import { AttributeTypeTranslator } from "src/app/shared/attribute-type-translator";
import { ContractAttributeType } from "src/loot-hoarder-contract/contract-attribute-type";
import { PassiveAbilityType } from "./passive-ability-type";

export class PassiveAbility {
  public type: PassiveAbilityType;
  public parameters: any;

  public constructor(type: PassiveAbilityType, parameters: any) {
    this.type = type;
    this.parameters = parameters;
  }

  public get description(): string {
    switch(this.type.key) {
      case 'attribute': {
        const attributeType: ContractAttributeType = this.parameters.attributeType;
        const abilityTags: string[] = this.parameters.abilityTags;
        const amount: number = this.parameters.amount;
        const isAdditive: boolean = this.parameters.isAdditive;

        const attributeTypeText = AttributeTypeTranslator.translate(attributeType);
        const abilityTagText = abilityTags.length > 0 
          ? abilityTags
            .map(tag => AbilityTagTranslator.translate(tag))
            .join(' ') 
            + ' ' 
          : '';
        const amountText = isAdditive ? amount : 'x' + amount;
        return abilityTagText + attributeTypeText + ' ' + amountText;
      }
      default: 
        throw Error(`Unhandled ability type: ${this.type.key}`);
    }
  }
}