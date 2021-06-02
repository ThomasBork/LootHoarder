import { AbilityTargetScheme } from "./ability-target-scheme";
import { AbilityTypeEffect } from "./ability-type-effect";
import { AbilityTypeEffectType } from "./ability-type-effect-type";

interface ApplyContinuousEffectParameters {
  typeKey: string,
  duration: number,
  parameters: any
}

export class AbilityTypeEffectApplyContinuousEffect extends AbilityTypeEffect {
  public parameters: ApplyContinuousEffectParameters;

  public constructor(
    type: AbilityTypeEffectType,
    tags: string[],
    targetScheme: AbilityTargetScheme,
    parameters: ApplyContinuousEffectParameters
  ) {
    super(type, tags, targetScheme);
    this.parameters = parameters;
  }
}