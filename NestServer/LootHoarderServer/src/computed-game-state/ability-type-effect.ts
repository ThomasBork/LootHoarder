import { AbilityTargetScheme } from "./ability-target-scheme";
import { AbilityTypeEffectType } from "./ability-type-effect-type";

export class AbilityTypeEffect {
  public type: AbilityTypeEffectType;
  public targetScheme: AbilityTargetScheme;
  public parameters: any;

  public constructor(
    type: AbilityTypeEffectType,
    targetScheme: AbilityTargetScheme,
    parameters: any
  ) {
    this.type = type;
    this.targetScheme = targetScheme;
    this.parameters = parameters;
  }

  public get requiresTarget(): boolean {
    return this.targetScheme === AbilityTargetScheme.any
      || this.targetScheme === AbilityTargetScheme.anyAlly
      || this.targetScheme === AbilityTargetScheme.anyEnemy;
  }

  public get canTargetAllies(): boolean {
    return this.targetScheme === AbilityTargetScheme.any
      || this.targetScheme === AbilityTargetScheme.anyAlly;
  }

  public get canTargetEnemies(): boolean {
    return this.targetScheme === AbilityTargetScheme.any
      || this.targetScheme === AbilityTargetScheme.anyEnemy;
  }
}