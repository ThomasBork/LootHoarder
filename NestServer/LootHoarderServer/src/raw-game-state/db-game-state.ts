import { DbArea } from './db-area';
import { DbHero } from './db-hero';

export interface DbGameState {
  heroes: DbHero[];
  areas: DbArea[];
  completedAreaTypes: string[];
  nextHeroId: number;
  nextAreaId: number;
  nextCombatId: number;
}
