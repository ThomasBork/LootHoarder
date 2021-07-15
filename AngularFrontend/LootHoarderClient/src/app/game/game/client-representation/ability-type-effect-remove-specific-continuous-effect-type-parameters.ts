import { ContinuousEffectType } from "./continuous-effect-type";

export class AbilityTypeEffectRemoveSpecificContinuousEffectTypeParameters {
  public continuousEffectType: ContinuousEffectType;

  public constructor(
    continuousEffectType: ContinuousEffectType,
  ) {
    this.continuousEffectType = continuousEffectType;
  }
}