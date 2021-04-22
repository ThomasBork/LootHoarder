export interface UICombatCharacter {
  id: number;
  typeKey: string;
  controllingUserId?: number;
  name: string;
  currentHealth: number;
}