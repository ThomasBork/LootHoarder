import { DbArea } from './db-area';
import { DbGameSettings } from './db-game-settings';
import { DbHero } from './db-hero';
import { DbItem } from './db-item';

export interface DbGameState {
  heroes: DbHero[];
  areas: DbArea[];
  items: DbItem[];
  completedAreaTypes: string[];
  nextHeroId: number;
  nextAreaId: number;
  nextCombatId: number;
  nextCombatCharacterAbilityId: number;
  nextItemId: number;
  nextContinuousEffectId: number;
  settings: DbGameSettings;
}
