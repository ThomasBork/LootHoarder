import { DbItemPassiveAbility } from "./db-item-passive-ability";

export interface DbItem {
  id: number;
  level: number;
  typeKey: string;
  innateAbilities: DbItemPassiveAbility[];
  additionalAbilities: DbItemPassiveAbility[];
}