import { ServerAreaHero } from "./server-area-hero";
import { ServerCombat } from "./server-combat";

export interface ServerArea {
  id: number;
  typeKey: string;
  heroes: ServerAreaHero[];
  currentCombat: ServerCombat;
  totalAmountOfCombats: number;
  currentCombatNumber: number;
}