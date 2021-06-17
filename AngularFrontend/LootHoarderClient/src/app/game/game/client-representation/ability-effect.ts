import { AbilityTagTranslator } from "src/app/shared/ability-tag-translator";
import { AttributeTypeTranslator } from "src/app/shared/attribute-type-translator";
import { ListPrinter } from "src/app/shared/list-printer";
import { NumberPrinter } from "src/app/shared/number-printer";
import { ContractAttributeType } from "src/loot-hoarder-contract/contract-attribute-type";
import { ContractPassiveAbilityTypeKey } from "src/loot-hoarder-contract/contract-passive-ability-type-key";
import { ContractAbilityTargetScheme } from "src/loot-hoarder-contract/server-actions/combat-messages/contract-ability-target-scheme";
import { AbilityType } from "./ability-type";
import { AbilityTypeEffect } from "./ability-type-effect";
import { AbilityTypeEffectApplyContinuousEffect } from "./ability-type-effect-apply-continuous-effect";
import { AbilityTypeEffectDealDamage } from "./ability-type-effect-deal-damage";
import { ContinuousEffectTypeAbilityRecipe } from "./continuous-effect-type-ability-recipe";

export class AbilityEffect {
  public abilityType: AbilityType;
  public abilityTypeEffect: AbilityTypeEffect;
  public power: number;

  public constructor(
    abilityType: AbilityType,
    abilityTypeEffect: AbilityTypeEffect,
    power: number,
  ) {
    this.abilityType = abilityType;
    this.abilityTypeEffect = abilityTypeEffect;
    this.power = power;
  }

  public get description(): string {
    if (this.abilityTypeEffect instanceof AbilityTypeEffectDealDamage) {
      const damageAmount = this.abilityTypeEffect.parameters.baseAmount * (this.power / 100);
      const tags = this.abilityTypeEffect.tags
        .map(tag => AbilityTagTranslator.translate(tag))
        .join(' ');
      const tagsText = tags.length > 0
        ? ' ' + tags 
        : '';
      const damageText = damageAmount.toFixed() + tagsText;
      const targetScheme = this.translateTargetScheme(this.abilityTypeEffect.targetScheme);
      const description = `Deals ${damageText} damage to ${targetScheme}`;
      return description;
    } else if (this.abilityTypeEffect instanceof AbilityTypeEffectApplyContinuousEffect) {
      const abilityTypeEffect = this.abilityTypeEffect;
      const continuousEffectType = this.abilityTypeEffect.parameters.continuousEffectType;
      const continuousEffectTypeName = continuousEffectType.name;
      const targetScheme = this.translateTargetScheme(this.abilityTypeEffect.targetScheme);
      const durationInSeconds = this.abilityTypeEffect.parameters.duration / 1000;
      const durationText = NumberPrinter.printFloorOnNthDecimal(durationInSeconds, 1);
      const continuousEffectAbilityRecipeDescriptions = this.abilityTypeEffect.parameters.continuousEffectType.abilityRecipes
        .map((recipe, recipeIndex) => {
          const additionalAbilityParameters = abilityTypeEffect.parameters.additionalAbilityParameters[recipeIndex];
          return this.getContinuousEffectAbilityRecipeDescription(
            recipe,
            additionalAbilityParameters,
            this.power
          );
        });

      const continuousEffectAbilityRecipeDescriptionText = ListPrinter.print(continuousEffectAbilityRecipeDescriptions);
      
      const description = `Applies ${continuousEffectTypeName} to ${targetScheme} for ${durationText} seconds, which ${continuousEffectAbilityRecipeDescriptionText}`;
      return description;
    } else {
      throw Error (`Unhandled ability type effect: ${this.abilityTypeEffect.type.key}`);
    }
  }

  private translateTargetScheme(targetScheme: ContractAbilityTargetScheme): string {
    switch(targetScheme) {
      case ContractAbilityTargetScheme.all: return 'all characters';
      case ContractAbilityTargetScheme.allAllies: return 'all allies';
      case ContractAbilityTargetScheme.allEnemies: return 'all enemies';
      case ContractAbilityTargetScheme.any: return 'the target';
      case ContractAbilityTargetScheme.anyAlly: return 'the target';
      case ContractAbilityTargetScheme.anyEnemy: return 'the target';
      case ContractAbilityTargetScheme.none: return 'no target';
      default: throw Error (`Unhandled target scheme: ${targetScheme}.`);
    }
  }

  private floorOnNthDecimal(number: number, n: number): number {
    const factor = Math.pow(10, n);
    return Math.floor(number * factor) / factor;
  }

  private getContinuousEffectAbilityRecipeDescription(
    recipe: ContinuousEffectTypeAbilityRecipe, 
    additionalAbilityParameters: { [keys: string]: string | boolean | number | string[] },
    power: number
  ): string {
    switch(recipe.passiveAbilityType.key) {
      case ContractPassiveAbilityTypeKey.takeDamageOverTime: {
        const abilityTags = recipe.parameters.abilityTags as string[];
        const damagePerSecondBeforePower = additionalAbilityParameters.damagePerSecond as number;

        const tagsWithSpaces = abilityTags
          .map(tag => AbilityTagTranslator.translate(tag))
          .join(' ');
        
        const damagePerSecondGiven = damagePerSecondBeforePower * power / 100;
        const damagePerSecondGivenText = NumberPrinter.printFloorOnNthDecimal(damagePerSecondGiven, 0);
        const damageText = `${damagePerSecondGivenText}${tagsWithSpaces.length > 0 ? ' ' + tagsWithSpaces  : ''}`;
        const description = `deals ${damageText} damage per second`;
        return description;
      }
      case ContractPassiveAbilityTypeKey.attribute: {
        const isAdditive = recipe.parameters.isAdditive as boolean;
        const attributeType = recipe.parameters.attributeType as ContractAttributeType;
        const abilityTags = recipe.parameters.abilityTags as string[];
        const amount = recipe.parameters.amount as number;

        const translatedAttributeType = AttributeTypeTranslator.translate(attributeType);

        const tagsWithSpaces = abilityTags
          .map(tag => AbilityTagTranslator.translate(tag))
          .join(' ');

        const attributeText = `${tagsWithSpaces.length > 0 ? tagsWithSpaces + ' ' : ''}${translatedAttributeType}`;
        let description = '';
        if (isAdditive) {
          if (amount >= 0) {
            const amountText = NumberPrinter.printFloorOnNthDecimal(amount, 0);
            description = `increases ${attributeText} by ${amountText}`;
          } else {
            const amountText = NumberPrinter.printFloorOnNthDecimal(-amount, 0);
            description = `reduces ${attributeText} by ${amountText}`;
          }
        } else {
          if (amount >= 1) {
            const percentage = (amount - 1) * 100;
            const percentageText = NumberPrinter.printFloorOnNthDecimal(percentage, 0);
            description = `increases ${attributeText} by ${percentageText}%`;
          } else {
            const percentage = (1 - amount) * 100;
            const percentageText = NumberPrinter.printFloorOnNthDecimal(percentage, 0);
            description = `reduces ${attributeText} by ${percentageText}%`;
          }
        }
        return description;
      }
      default: 
        throw Error (`Unhandled passive ability type: ${recipe.passiveAbilityType.key}`);
    }
  }
}
