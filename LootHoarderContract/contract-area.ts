import { ContractAreaHero } from "./contract-area-hero";
import { ContractCombat } from "./contract-combat";
import { ContractLoot } from "./contract-loot";

export interface ContractArea {
  id: number;
  typeKey: string;
  heroes: ContractAreaHero[];
  currentCombat: ContractCombat;
  totalAmountOfCombats: number;
  currentCombatNumber: number;
  loot: ContractLoot;
}
