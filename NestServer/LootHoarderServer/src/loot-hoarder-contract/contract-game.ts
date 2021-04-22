import { ContractArea } from "./contract-area";
import { ContractHero } from "./contract-hero";

export interface ContractGame {
  id: number;
  createdAt: Date;
  heroes: ContractHero[];
  areas: ContractArea[];
  completedAreaTypeKeys: string[];
  availableAreaTypeKeys: string[];
}
