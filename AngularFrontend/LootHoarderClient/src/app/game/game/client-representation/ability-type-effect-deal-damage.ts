import { ContractAbilityTargetScheme } from "src/loot-hoarder-contract/server-actions/combat-messages/contract-ability-target-scheme";
import { AbilityTypeEffect } from "./ability-type-effect";
import { AbilityTypeEffectDealDamageParameters } from "./ability-type-effect-deal-damage-parameters";
import { AbilityTypeEffectType } from "./ability-type-effect-type";

export class AbilityTypeEffectDealDamage extends AbilityTypeEffect {
  public parameters: AbilityTypeEffectDealDamageParameters;

  public constructor(
    type: AbilityTypeEffectType,
    tags: string[],
    targetScheme: ContractAbilityTargetScheme,
    parameters: AbilityTypeEffectDealDamageParameters
  ) {
    super(type, tags, targetScheme);
    this.parameters = parameters;
  }
}