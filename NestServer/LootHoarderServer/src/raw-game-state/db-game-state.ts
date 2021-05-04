import { DbArea } from './db-area';
import { DbGameSettings } from './db-game-settings';
import { DbHero } from './db-hero';

export interface DbGameState {
  heroes: DbHero[];
  areas: DbArea[];
  completedAreaTypes: string[];
  nextHeroId: number;
  nextAreaId: number;
  nextCombatId: number;
  nextAbilityId: number;
  settings: DbGameSettings;
}
