import { DbInventory } from "./db-inventory";

export interface DbHero {
  id: number;
  typeKey: string;
  name: string;
  level: number;
  experience: number;
  abilityTypeKeys: string[];
  inventory: DbInventory;
}
