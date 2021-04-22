import { ContractLoot } from "./contract-loot";

export interface ContractAreaHero {
  gameId: number;
  heroId: number;
  loot: ContractLoot;
  combatCharacterId: number;
}