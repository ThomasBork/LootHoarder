import { DbLoot } from "./db-loot";

export interface DbAreaHero {
  gameId: number;
  heroId: number;
  loot: DbLoot;
  combatCharacterId: number;
}