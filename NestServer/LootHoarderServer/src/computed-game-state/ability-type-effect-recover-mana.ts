import { AbilityTargetScheme } from "./ability-target-scheme";
import { AbilityTypeEffect } from "./ability-type-effect";
import { AbilityTypeEffectType } from "./ability-type-effect-type";

interface RecoverManaParameters {
  baseAmount: number
}

export class AbilityTypeEffectRecoverMana extends AbilityTypeEffect {
  public parameters: RecoverManaParameters;

  public constructor(
    type: AbilityTypeEffectType,
    tags: string[],
    targetScheme: AbilityTargetScheme,
    parameters: RecoverManaParameters
  ) {
    super(type, tags, targetScheme);
    this.parameters = parameters;
  }
}