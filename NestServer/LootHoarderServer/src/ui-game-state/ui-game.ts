import { UIArea } from "./ui-area";
import { UIHero } from "./ui-hero";

export interface UIGame {
  id: number;
  createdAt: Date;
  heroes: UIHero[];
  areas: UIArea[];
  completedAreaTypeKeys: string[];
  availableAreaTypeKeys: string[];
}
