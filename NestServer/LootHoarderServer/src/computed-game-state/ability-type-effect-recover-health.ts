import { AbilityTargetScheme } from "./ability-target-scheme";
import { AbilityTypeEffect } from "./ability-type-effect";
import { AbilityTypeEffectType } from "./ability-type-effect-type";

interface RecoverHealthParameters {
  baseAmount: number
}

export class AbilityTypeEffectRecoverHealth extends AbilityTypeEffect {
  public parameters: RecoverHealthParameters;

  public constructor(
    type: AbilityTypeEffectType,
    tags: string[],
    targetScheme: AbilityTargetScheme,
    parameters: RecoverHealthParameters
  ) {
    super(type, tags, targetScheme);
    this.parameters = parameters;
  }
}