export interface ContractCombatCharacter {
  id: number;
  typeKey: string;
  controllingUserId?: number;
  name: string;
  currentHealth: number;
}