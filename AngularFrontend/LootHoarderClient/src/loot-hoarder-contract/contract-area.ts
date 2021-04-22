import { ContractAreaHero } from "./contract-area-hero";
import { ContractCombat } from "./contract-combat";

export interface ContractArea {
  id: number;
  typeKey: string;
  heroes: ContractAreaHero[];
  currentCombat: ContractCombat;
  totalAmountOfCombats: number;
  currentCombatNumber: number;
}