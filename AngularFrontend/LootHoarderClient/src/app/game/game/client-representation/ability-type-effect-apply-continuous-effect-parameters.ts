import { ContinuousEffectType } from "./continuous-effect-type";

export class AbilityTypeEffectApplyContinuousEffectParameters {
  public continuousEffectType: ContinuousEffectType;
  public duration: number;
  public additionalAbilityParameters: { [keys: string]: string | boolean | number | string[] }[];

  public constructor(
    continuousEffectType: ContinuousEffectType,
    duration: number,
    additionalAbilityParameters: { [keys: string]: string | boolean | number | string[] }[],
  ) {
    this.continuousEffectType = continuousEffectType;
    this.duration = duration;
    this.additionalAbilityParameters = additionalAbilityParameters;
  }
}