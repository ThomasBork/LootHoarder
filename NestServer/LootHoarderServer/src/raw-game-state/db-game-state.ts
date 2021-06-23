import { DbAchievementTypeStatus } from './db-achievement-type-status';
import { DbArea } from './db-area';
import { DbGameSettings } from './db-game-settings';
import { DbHero } from './db-hero';
import { DbItem } from './db-item';
import { DbQuestTypeStatus } from './db-quest-type-status';

export interface DbGameState {
  heroes: DbHero[];
  areas: DbArea[];
  items: DbItem[];
  completedAreaTypes: string[];
  completedQuestTypes: string[];
  completedAchievementTypes: string[];
  questTypeStatuses: DbQuestTypeStatus[];
  achievementTypeStatuses: DbAchievementTypeStatus[];
  nextHeroId: number;
  nextAreaId: number;
  nextCombatId: number;
  nextCombatCharacterAbilityId: number;
  nextItemId: number;
  nextContinuousEffectId: number;
  settings: DbGameSettings;
}
