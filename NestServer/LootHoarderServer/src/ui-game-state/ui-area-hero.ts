import { UILoot } from "./ui-loot";

export interface UIAreaHero {
  gameId: number;
  heroId: number;
  loot: UILoot;
  combatCharacterId: number;
}