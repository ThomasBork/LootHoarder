import { DbPassiveAbility } from "./db-passive-ability";

export interface DbItem {
  id: number;
  typeKey: string;
  innateAbilities: DbPassiveAbility[];
  additionalAbilities: DbPassiveAbility[];
}