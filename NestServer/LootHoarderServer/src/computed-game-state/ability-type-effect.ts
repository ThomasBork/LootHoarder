import { AbilityTargetScheme } from "./ability-target-scheme";
import { AbilityTypeEffectType } from "./ability-type-effect-type";

export class AbilityTypeEffect {
  public type: AbilityTypeEffectType;
  public tags: string[];
  public targetScheme: AbilityTargetScheme;

  public constructor(
    type: AbilityTypeEffectType,
    tags: string[],
    targetScheme: AbilityTargetScheme,
  ) {
    this.type = type;
    this.tags = tags;
    this.targetScheme = targetScheme;
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