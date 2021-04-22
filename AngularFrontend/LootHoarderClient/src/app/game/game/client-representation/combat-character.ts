export class CombatCharacter {
  public id: number;
  public typeKey: string;
  public controllingUserId?: number;
  public name: string;
  public currentHealth: number;

  public constructor(
    id: number,
    typeKey: string,
    controllingUserId: number | undefined,
    name: string,
    currentHealth: number
  ) {
    this.id = id;
    this.typeKey = typeKey;
    this.controllingUserId = controllingUserId;
    this.name = name;
    this.currentHealth = currentHealth;
  }
}