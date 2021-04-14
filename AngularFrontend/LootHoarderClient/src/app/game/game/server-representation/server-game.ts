import { ServerArea } from "./server-area";
import { ServerHero } from "./server-hero";

export interface ServerGame {
  id: number;
  createdAt: Date;
  heroes: ServerHero[];
  areas: ServerArea[];
  completedAreaTypeKeys: string[];
  availableAreaTypeKeys: string[];
}
