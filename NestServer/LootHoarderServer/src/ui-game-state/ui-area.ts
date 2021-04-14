import { UIAreaHero } from "./ui-area-hero";
import { UICombat } from "./ui-combat";

export interface UIArea {
  id: number;
  typeKey: string;
  heroes: UIAreaHero[];
  currentCombat: UICombat;
  totalAmountOfCombats: number;
  currentCombatNumber: number;
}