import { DbCombat } from 'src/raw-game-state/db-combat';
import { UICombat } from 'src/ui-game-state/ui-combat';
import { CombatCharacter } from './combat-character';

export class Combat {
  public team1: CombatCharacter[];
  public team2: CombatCharacter[];

  private dbModel: DbCombat;

  private constructor(
    dbModel: DbCombat,
    team1: CombatCharacter[],
    team2: CombatCharacter[],
  ) {
    this.dbModel = dbModel;
    this.team1 = team1;
    this.team2 = team2;
  }

  public get id(): number { return this.dbModel.id; }

  public getUIState(): UICombat {
    return {
      id: this.dbModel.id,
      team1: this.team1.map(c => c.getUIState()),
      team2: this.team2.map(c => c.getUIState())
    };
  }

  public static load(dbModel: DbCombat): Combat {
    const team1 = dbModel.team1.map(CombatCharacter.load);
    const team2 = dbModel.team2.map(CombatCharacter.load);

    const combat = new Combat(dbModel, team1, team2);
    return combat;
  }
}
