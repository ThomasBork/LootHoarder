import { AbilityTagTranslator } from "src/app/shared/ability-tag-translator";
import { ContractAbilityTargetScheme } from "src/loot-hoarder-contract/server-actions/combat-messages/contract-ability-target-scheme";
import { AbilityType } from "./ability-type";
import { AbilityTypeEffect } from "./ability-type-effect";
import { AbilityTypeEffectApplyContinuousEffect } from "./ability-type-effect-apply-continuous-effect";
import { AbilityTypeEffectDealDamage } from "./ability-type-effect-deal-damage";

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
      const continuousEffectName = this.abilityTypeEffect.parameters.continuousEffectType.name;
      const targetScheme = this.translateTargetScheme(this.abilityTypeEffect.targetScheme);
      const durationInSeconds = this.abilityTypeEffect.parameters.duration / 1000;
      const durationText = this.floorOnNthDecimal(durationInSeconds, 1);
      const description = `Applies ${continuousEffectName} to ${targetScheme} for ${durationText} seconds`;
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
}
