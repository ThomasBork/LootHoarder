import { DbAbility } from "./db-ability";
import { DbAttributeSet } from "./db-attribute-set";

export interface DbCombatCharacter {
  id: number;
  typeKey: string;
  controllingUserId?: number;
  name: string;
  currentHealth: number;
  attributeSet: DbAttributeSet;
  abilities: DbAbility[];
  idOfAbilityBeingUsed?: number;
  idOfTargetOfAbilityBeingUsed?: number;
  remainingTimeToUseAbility: number;
}
