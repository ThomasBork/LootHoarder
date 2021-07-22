import { Injectable } from "@angular/core";
import { AbilityTagTranslator } from "src/app/shared/ability-tag-translator";
import { AttributeTypeTranslator } from "src/app/shared/attribute-type-translator";
import { ListPrinter } from "src/app/shared/list-printer";
import { NumberPrinter } from "src/app/shared/number-printer";
import { ContractAttributeType } from "src/loot-hoarder-contract/contract-attribute-type";
import { ContractPassiveAbilityTypeKey } from "src/loot-hoarder-contract/contract-passive-ability-type-key";
import { ContractAbilityTargetScheme } from "src/loot-hoarder-contract/server-actions/combat-messages/contract-ability-target-scheme";
import { AbilityEffect } from "./client-representation/ability-effect";
import { AbilityTypeEffect } from "./client-representation/ability-type-effect";
import { AbilityTypeEffectApplyContinuousEffect } from "./client-representation/ability-type-effect-apply-continuous-effect";
import { AbilityTypeEffectDealDamage } from "./client-representation/ability-type-effect-deal-damage";
import { AbilityTypeEffectRecoverHealth } from "./client-representation/ability-type-effect-recover-health";
import { AbilityTypeEffectRecoverMana } from "./client-representation/ability-type-effect-recover-mana";
import { AbilityTypeEffectRemoveSpecificContinuousEffectType } from "./client-representation/ability-type-effect-remove-specific-continuous-effect-type";
import { ContinuousEffectTypeAbilityRecipe } from "./client-representation/continuous-effect-type-ability-recipe";

@Injectable()
export class AbilityTextService {
  public getAbilityTypeEffectDescription(effect: AbilityTypeEffect): string {
    if (effect instanceof AbilityTypeEffectDealDamage) {
      return this.getDealDamageDescription(effect, 100);
    } else if (effect instanceof AbilityTypeEffectApplyContinuousEffect) {
      return this.getApplyContinuousEffectDescription(effect, 100);
    } else if (effect instanceof AbilityTypeEffectRecoverMana) {
      return this.getRecoverManaDescription(effect);
    } else if (effect instanceof AbilityTypeEffectRecoverHealth) {
      return this.getRecoverHealthDescription(effect);
    } else if (effect instanceof AbilityTypeEffectRemoveSpecificContinuousEffectType) {
      return this.getRemoveSpecificContinuousEffectTypeDescription(effect);
    } else {
      throw Error (`Unhandled ability type effect: ${effect.type.key}`);
    }
  }

  public getAbilityEffectDescription(effect: AbilityEffect): string {
    if (effect.abilityTypeEffect instanceof AbilityTypeEffectDealDamage) {
      return this.getDealDamageDescription(effect.abilityTypeEffect, effect.damageEffect);
    } else if (effect.abilityTypeEffect instanceof AbilityTypeEffectApplyContinuousEffect) {
      return this.getApplyContinuousEffectDescription(effect.abilityTypeEffect, effect.damageEffect);
    } else if (effect.abilityTypeEffect instanceof AbilityTypeEffectRecoverMana) {
      return this.getRecoverManaDescription(effect.abilityTypeEffect);
    } else if (effect.abilityTypeEffect instanceof AbilityTypeEffectRecoverHealth) {
      return this.getRecoverHealthDescription(effect.abilityTypeEffect);
    } else if (effect.abilityTypeEffect instanceof AbilityTypeEffectRemoveSpecificContinuousEffectType) {
      return this.getRemoveSpecificContinuousEffectTypeDescription(effect.abilityTypeEffect);
    } else {
      throw Error (`Unhandled ability type effect: ${effect.abilityTypeEffect.type.key}`);
    }
  }

  private getDealDamageDescription(effect: AbilityTypeEffectDealDamage, characterDamageEffect: number): string {
    const damageAmount = effect.parameters.baseAmount * (characterDamageEffect / 100);
    const tags = effect.tags
      .map(tag => AbilityTagTranslator.translate(tag))
      .join(' ');
    const tagsText = tags.length > 0
      ? ' ' + tags 
      : '';
    const damageText = damageAmount.toFixed() + tagsText;
    const targetScheme = this.translateTargetScheme(effect.targetScheme);
    const description = `Deals ${damageText} damage to ${targetScheme}`;
    return description;
  }

  private getApplyContinuousEffectDescription(effect: AbilityTypeEffectApplyContinuousEffect, characterDamageEffect: number): string {
    const abilityTypeEffect = effect;
    const continuousEffectType = effect.parameters.continuousEffectType;
    const continuousEffectTypeName = continuousEffectType.name;
    const targetScheme = this.translateTargetScheme(effect.targetScheme);
    const durationInSeconds = effect.parameters.duration / 1000;
    const durationText = NumberPrinter.printFloorOnNthDecimal(durationInSeconds, 1);
    const continuousEffectAbilityRecipeDescriptions = effect.parameters.continuousEffectType.abilityRecipes
      .map((recipe, recipeIndex) => {
        const additionalAbilityParameters = abilityTypeEffect.parameters.additionalAbilityParameters[recipeIndex];
        return this.getContinuousEffectAbilityRecipeDescription(
          recipe,
          additionalAbilityParameters,
          characterDamageEffect
        );
      });

    const continuousEffectAbilityRecipeDescriptionText = ListPrinter.print(continuousEffectAbilityRecipeDescriptions);
    
    const description = `Applies ${continuousEffectTypeName} to ${targetScheme} for ${durationText} seconds, which ${continuousEffectAbilityRecipeDescriptionText}`;
    return description;
  }

  private getRecoverManaDescription(effect: AbilityTypeEffectRecoverMana): string {
    const manaAmount = effect.parameters.baseAmount;
    const targetScheme = this.translateTargetScheme(effect.targetScheme);
    const description = `Restores ${manaAmount} mana to ${targetScheme}`;
    return description;
  }

  private getRecoverHealthDescription(effect: AbilityTypeEffectRecoverHealth): string {
    const healthAmount = effect.parameters.baseAmount;
    const targetScheme = this.translateTargetScheme(effect.targetScheme);
    const description = `Restores ${healthAmount} health to ${targetScheme}`;
    return description;
  }

  private getRemoveSpecificContinuousEffectTypeDescription(effect: AbilityTypeEffectRemoveSpecificContinuousEffectType): string {
    const continuousEffectType = effect.parameters.continuousEffectType;
    const continuousEffectTypeName = continuousEffectType.name;
    const targetScheme = this.translateTargetScheme(effect.targetScheme);
    
    const description = `Removes ${continuousEffectTypeName} from ${targetScheme}`;
    return description;
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
      case ContractAbilityTargetScheme.self: return 'the user';
      default: throw Error (`Unhandled target scheme: ${targetScheme}.`);
    }
  }
  
  private getContinuousEffectAbilityRecipeDescription(
    recipe: ContinuousEffectTypeAbilityRecipe, 
    additionalAbilityParameters: { [keys: string]: string | boolean | number | string[] },
    damageEffect: number
  ): string {
    switch(recipe.passiveAbilityType.key) {
      case ContractPassiveAbilityTypeKey.takeDamageOverTime: {
        const abilityTags = recipe.parameters.abilityTags as string[];
        const damagePerSecondBeforeDamageEffect = additionalAbilityParameters.damagePerSecond as number;

        const tagsWithSpaces = abilityTags
          .map(tag => AbilityTagTranslator.translate(tag))
          .join(' ');
        
        const damagePerSecondGiven = damagePerSecondBeforeDamageEffect * damageEffect / 100;
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
      case ContractPassiveAbilityTypeKey.removeOnDamageTaken: {
        const abilityTags = recipe.parameters.abilityTags as string[];

        const tagsWithSpaces = abilityTags
          .map(tag => AbilityTagTranslator.translate(tag))
          .join(' ');
        
        const damageText = `${tagsWithSpaces.length > 0 ? tagsWithSpaces + ' ' : ''}`;
        const description = `is removed when taking ${damageText}damage`;
        return description;
      }
      default: 
        throw Error (`Unhandled passive ability type: ${recipe.passiveAbilityType.key}`);
    }
  }
}
