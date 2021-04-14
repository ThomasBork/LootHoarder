export class CombatCharacter {
  public id: number;
  public controllingUserId?: number;
  public name: string;
  public currentHealth: number;

  public constructor(
    id: number,
    controllingUserId: number | undefined,
    name: string,
    currentHealth: number
  ) {
    this.id = id;
    this.controllingUserId = controllingUserId;
    this.name = name;
    this.currentHealth = currentHealth;
  }
}