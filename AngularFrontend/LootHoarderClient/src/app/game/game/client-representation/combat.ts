import { CombatCharacter } from "./combat-character";

export class Combat {
  public id: number;
  public team1: CombatCharacter[];
  public team2: CombatCharacter[];

  public constructor(
    id: number,
    team1: CombatCharacter[],
    team2: CombatCharacter[]
  ) {
    this.id = id;
    this.team1 = team1;
    this.team2 = team2;
  }
}