import { AbilityTargetScheme } from "./ability-target-scheme";
import { AbilityTypeEffect } from "./ability-type-effect";
import { AbilityTypeEffectApplyContinuousEffectParameters } from "./ability-type-effect-apply-continuous-effect-parameters";
import { AbilityTypeEffectType } from "./ability-type-effect-type";

export class AbilityTypeEffectApplyContinuousEffect extends AbilityTypeEffect {
  public parameters: AbilityTypeEffectApplyContinuousEffectParameters;

  public constructor(
    type: AbilityTypeEffectType,
    tags: string[],
    targetScheme: AbilityTargetScheme,
    parameters: AbilityTypeEffectApplyContinuousEffectParameters
  ) {
    super(type, tags, targetScheme);
    this.parameters = parameters;
  }
}