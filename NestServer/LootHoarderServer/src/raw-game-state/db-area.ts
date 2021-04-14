import { DbAreaHero } from "./db-area-hero";
import { DbCombat } from "./db-combat";

export interface DbArea {
  id: number;
  typeKey: string;
  heroes: DbAreaHero[];
  currentCombat: DbCombat;
  totalAmountOfCombats: number;
  currentCombatNumber: number;
}
