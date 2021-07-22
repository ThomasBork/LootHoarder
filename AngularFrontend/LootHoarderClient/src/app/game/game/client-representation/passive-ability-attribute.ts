import { AttributeTypeTranslator } from "src/app/shared/attribute-type-translator";
import { PassiveAbility } from "./passive-ability";
import { PassiveAbilityParametersAttribute } from "./passive-ability-parameters-attribute";
import { PassiveAbilityType } from "./passive-ability-type";

export class PassiveAbilityAttribute extends PassiveAbility {
  public type!: PassiveAbilityType;
  public parameters!: PassiveAbilityParametersAttribute;

  public constructor(type: PassiveAbilityType, parameters: PassiveAbilityParametersAttribute) {
    super(type, parameters);
  }

  public get description(): string {
    const attributeType = this.parameters.attributeType;
    const abilityTags = this.parameters.abilityTags;
    const amount = this.parameters.amount;
    const isAdditive = this.parameters.isAdditive;

    const attributeTypeText = AttributeTypeTranslator.translate(attributeType);
    const abilityTagText = abilityTags.length > 0 
      ? this.getAbilityTagList(abilityTags) + ' ' 
      : '';
    const amountText = isAdditive ? amount : this.getMultiplicativeText(amount);
    return abilityTagText + attributeTypeText + ' ' + amountText;
  }

  private getMultiplicativeText(amount: number): string {
    const changeInPercent = (amount - 1) * 100;
    const prettyChangeInPercent = Math.round(changeInPercent);
    if (changeInPercent > 0) {
      return `+${prettyChangeInPercent}%`;
    } else {
      return `-${prettyChangeInPercent}%`;
    }
  }
}
