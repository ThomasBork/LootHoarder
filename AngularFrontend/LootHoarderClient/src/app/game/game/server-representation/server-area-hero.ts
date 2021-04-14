import { ServerLoot } from "./server-loot";

export interface ServerAreaHero {
  gameId: number;
  heroId: number;
  loot: ServerLoot;
  combatCharacterId: number;
}