import { CombatCharacter } from "./combat-character";

export class Combat {
  public id: number;
  public team1: CombatCharacter[];
  public team2: CombatCharacter[];
  public hasEnded: boolean;
  public didTeam1Win?: boolean;

  public constructor(
    id: number,
    team1: CombatCharacter[],
    team2: CombatCharacter[],
    hasEnded: boolean,
    didTeam1Win?: boolean
  ) {
    this.id = id;
    this.team1 = team1;
    this.team2 = team2;
    this.hasEnded = hasEnded;
    this.didTeam1Win = didTeam1Win;
  }

  public getCharacter(id: number): CombatCharacter {
    let character: CombatCharacter | undefined;
    character = character || this.team1.find(c => c.id === id);
    character = character || this.team2.find(c => c.id === id);

    if (!character) {
      throw Error (`Could not find character with id: ${id}`);
    }

    return character;
  }

  public getAllCharacters(): CombatCharacter[] {
    return [...this.team1, ...this.team2];
  }
}