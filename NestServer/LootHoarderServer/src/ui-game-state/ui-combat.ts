import { UICombatCharacter } from "./ui-combat-character";

export interface UICombat {
  id: number;
  team1: UICombatCharacter[];
  team2: UICombatCharacter[];
}