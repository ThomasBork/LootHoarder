import { ContractAbilityTargetScheme } from "src/loot-hoarder-contract/server-actions/combat-messages/contract-ability-target-scheme";
import { AbilityTypeEffect } from "./ability-type-effect";
import { AbilityTypeEffectRecoverManaParameters } from "./ability-type-effect-recover-mana-parameters";
import { AbilityTypeEffectType } from "./ability-type-effect-type";

export class AbilityTypeEffectRecoverMana extends AbilityTypeEffect {
  public parameters: AbilityTypeEffectRecoverManaParameters;

  public constructor(
    type: AbilityTypeEffectType,
    tags: string[],
    targetScheme: ContractAbilityTargetScheme,
    parameters: AbilityTypeEffectRecoverManaParameters
  ) {
    super(type, tags, targetScheme);
    this.parameters = parameters;
  }
}