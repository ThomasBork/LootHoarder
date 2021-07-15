import { ContractAbilityTargetScheme } from "src/loot-hoarder-contract/server-actions/combat-messages/contract-ability-target-scheme";
import { AbilityTypeEffect } from "./ability-type-effect";
import { AbilityTypeEffectRecoverHealthParameters } from "./ability-type-effect-recover-health-parameters";
import { AbilityTypeEffectType } from "./ability-type-effect-type";

export class AbilityTypeEffectRecoverHealth extends AbilityTypeEffect {
  public parameters: AbilityTypeEffectRecoverHealthParameters;

  public constructor(
    type: AbilityTypeEffectType,
    tags: string[],
    targetScheme: ContractAbilityTargetScheme,
    parameters: AbilityTypeEffectRecoverHealthParameters
  ) {
    super(type, tags, targetScheme);
    this.parameters = parameters;
  }
}