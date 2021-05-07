import { DbItemAbility } from "./db-item-ability";

export interface DbItem {
  id: number;
  typeKey: string;
  innateAbilities: DbItemAbility[];
  additionalAbilities: DbItemAbility[];
}