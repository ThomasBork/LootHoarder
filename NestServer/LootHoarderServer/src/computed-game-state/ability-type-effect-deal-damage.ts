import { AbilityTargetScheme } from "./ability-target-scheme";
import { AbilityTypeEffect } from "./ability-type-effect";
import { AbilityTypeEffectType } from "./ability-type-effect-type";

interface DealDamageParameters {
  baseAmount: number
}

export class AbilityTypeEffectDealDamage extends AbilityTypeEffect {
  public parameters: DealDamageParameters;

  public constructor(
    type: AbilityTypeEffectType,
    tags: string[],
    targetScheme: AbilityTargetScheme,
    parameters: DealDamageParameters
  ) {
    super(type, tags, targetScheme);
    this.parameters = parameters;
  }
}