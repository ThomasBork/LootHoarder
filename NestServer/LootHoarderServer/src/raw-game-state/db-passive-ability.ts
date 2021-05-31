import { DbPassiveAbilityParameters } from "./db-passive-ability-parameters";

export interface DbPassiveAbility {
  typeKey: string;
  parameters: DbPassiveAbilityParameters;
}