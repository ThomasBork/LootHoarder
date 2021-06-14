import { ContractAbilityTargetScheme } from "src/loot-hoarder-contract/server-actions/combat-messages/contract-ability-target-scheme";
import { AbilityTypeEffectType } from "./ability-type-effect-type";

export class AbilityTypeEffect {
  public type: AbilityTypeEffectType;
  public tags: string[];
  public targetScheme: ContractAbilityTargetScheme;

  public constructor(
    type: AbilityTypeEffectType,
    tags: string[],
    targetScheme: ContractAbilityTargetScheme,
  ) {
    this.type = type;
    this.tags = tags;
    this.targetScheme = targetScheme;
  }

  public get requiresTarget(): boolean {
    return this.targetScheme === ContractAbilityTargetScheme.any
      || this.targetScheme === ContractAbilityTargetScheme.anyAlly
      || this.targetScheme === ContractAbilityTargetScheme.anyEnemy;
  }

  public get canTargetAllies(): boolean {
    return this.targetScheme === ContractAbilityTargetScheme.any
      || this.targetScheme === ContractAbilityTargetScheme.anyAlly;
  }

  public get canTargetEnemies(): boolean {
    return this.targetScheme === ContractAbilityTargetScheme.any
      || this.targetScheme === ContractAbilityTargetScheme.anyEnemy;
  }
}
