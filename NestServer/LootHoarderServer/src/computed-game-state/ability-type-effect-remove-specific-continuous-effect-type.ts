import { AbilityTargetScheme } from "./ability-target-scheme";
import { AbilityTypeEffect } from "./ability-type-effect";
import { AbilityTypeEffectRemoveSpecificContinuousEffectTypeParameters } from "./ability-type-effect-remove-specific-continuous-effect-type-parameters";
import { AbilityTypeEffectType } from "./ability-type-effect-type";

export class AbilityTypeEffectRemoveSpecificContinuousEffectType extends AbilityTypeEffect {
  public parameters: AbilityTypeEffectRemoveSpecificContinuousEffectTypeParameters;

  public constructor(
    type: AbilityTypeEffectType,
    tags: string[],
    targetScheme: AbilityTargetScheme,
    parameters: AbilityTypeEffectRemoveSpecificContinuousEffectTypeParameters
  ) {
    super(type, tags, targetScheme);
    this.parameters = parameters;
  }
}