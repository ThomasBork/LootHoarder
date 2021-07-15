import { ContinuousEffectType } from "./area/continuous-effect-type";

export class AbilityTypeEffectRemoveSpecificContinuousEffectTypeParameters {
  public continuousEffectType: ContinuousEffectType;

  public constructor(
    continuousEffectType: ContinuousEffectType,
  ) {
    this.continuousEffectType = continuousEffectType;
  }
}