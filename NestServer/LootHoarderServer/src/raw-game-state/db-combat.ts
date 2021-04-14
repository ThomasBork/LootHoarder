import { DbCombatCharacter } from './db-combat-character';

export interface DbCombat {
  id: number;
  team1: DbCombatCharacter[];
  team2: DbCombatCharacter[];
}
