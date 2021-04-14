import { ServerCombatCharacter } from "./server-combat-character";

export interface ServerCombat {
  id: number;
  team1: ServerCombatCharacter[];
  team2: ServerCombatCharacter[];
}