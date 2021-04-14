import { DbCombatCharacter } from 'src/raw-game-state/db-combat-character';
import { UICombatCharacter } from 'src/ui-game-state/ui-combat-character';

export class CombatCharacter {
  private dbModel: DbCombatCharacter;

  private constructor(
    dbModel: DbCombatCharacter
  ) {
    this.dbModel = dbModel;
  }

  public get id(): number { return this.dbModel.id; }
  public get currentHealth(): number { return this.dbModel.currentHealth; }
  public set currentHealth(value: number) { this.dbModel.currentHealth = value; }

  public getUIState(): UICombatCharacter {
    return {
      id: this.dbModel.id,
      currentHealth: this.dbModel.currentHealth,
      name: this.dbModel.name,
      controllingUserId: this.dbModel.controllingUserId
    };
  }

  public static load(dbModel: DbCombatCharacter): CombatCharacter {
    const combatCharacter = new CombatCharacter(dbModel);
    return combatCharacter;
  }
}
