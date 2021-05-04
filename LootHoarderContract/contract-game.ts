import { ContractArea } from "./contract-area";
import { ContractHero } from "./contract-hero";
import { ContractGameSettings } from "./contract-game-settings"

export interface ContractGame {
  id: number;
  createdAt: Date;
  heroes: ContractHero[];
  areas: ContractArea[];
  completedAreaTypeKeys: string[];
  availableAreaTypeKeys: string[];
  settings: ContractGameSettings;
}
