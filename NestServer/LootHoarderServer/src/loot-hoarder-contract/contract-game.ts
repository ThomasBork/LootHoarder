import { ContractArea } from "./contract-area";
import { ContractHero } from "./contract-hero";
import { ContractGameSettings } from "./contract-game-settings"
import { ContractItem } from "./contract-item";
import { ContractGameTab } from "./contract-game-tab";
import { ContractAchievementTypeStatus } from "./contract-achievement-type-status";
import { ContractQuestTypeStatus } from "./contract-quest-type-status";

export interface ContractGame {
  id: number;
  createdAt: Date;
  heroes: ContractHero[];
  areas: ContractArea[];
  completedAreaTypeKeys: string[];
  availableAreaTypeKeys: string[];
  completedQuestTypeKeys: string[];
  completedAchievementTypeKeys: string[];
  questTypeStatuses: ContractQuestTypeStatus[];
  achievementTypeStatuses: ContractAchievementTypeStatus[];
  settings: ContractGameSettings;
  items: ContractItem[];
  disabledGameTabs: ContractGameTab[];
  maximumAmountOfHeroes: number;
  gold: number;
}
