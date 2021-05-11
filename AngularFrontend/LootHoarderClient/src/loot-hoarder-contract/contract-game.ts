import { ContractArea } from "./contract-area";
import { ContractHero } from "./contract-hero";
import { ContractGameSettings } from "./contract-game-settings"
import { ContractItem } from "./contract-item";

export interface ContractGame {
  id: number;
  createdAt: Date;
  heroes: ContractHero[];
  areas: ContractArea[];
  completedAreaTypeKeys: string[];
  availableAreaTypeKeys: string[];
  settings: ContractGameSettings;
  items: ContractItem[];
  maximumAmountOfHeroes: number;
}
