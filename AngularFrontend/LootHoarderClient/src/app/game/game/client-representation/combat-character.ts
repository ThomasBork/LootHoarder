import { ContractAttributeType } from "src/loot-hoarder-contract/contract-attribute-type";
import { AttributeSet } from "./attribute-set";
import { CombatCharacterAbility } from "./combat-character-ability";
import { Hero } from "./hero";

export class CombatCharacter {
  public id: number;
  public typeKey: string;
  public controllingUserId?: number;
  public name: string;
  public currentHealth: number;
  public currentMana: number;
  public attributes: AttributeSet;
  public abilities: CombatCharacterAbility[];
  public remainingTimeToUseAbility: number;
  public totalTimeToUseAbility?: number;
  public abilityBeingUsed?: CombatCharacterAbility;
  public targetOfAbilityBeingUsed?: CombatCharacter;
  public hero?: Hero;

  public constructor(
    id: number,
    typeKey: string,
    controllingUserId: number | undefined,
    name: string,
    currentHealth: number,
    currentMana: number,
    attributes: AttributeSet,
    abilities: CombatCharacterAbility[],
    remainingTimeToUseAbility: number,
    totalTimeToUseAbility: number | undefined,
    abilityBeingUsed: CombatCharacterAbility | undefined
  ) {
    this.id = id;
    this.typeKey = typeKey;
    this.controllingUserId = controllingUserId;
    this.name = name;
    this.currentHealth = currentHealth;
    this.currentMana = currentMana;
    this.attributes = attributes;
    this.abilities = abilities;
    this.remainingTimeToUseAbility = remainingTimeToUseAbility;
    this.totalTimeToUseAbility = totalTimeToUseAbility;
    this.abilityBeingUsed = abilityBeingUsed;
  }

  public getAbility(id: number): CombatCharacterAbility {
    const ability = this.abilities.find(a => a.id === id);
    if (!ability) {
      throw Error (`Could not find ability with id: ${id}`);
    }
    return ability;
  }

  public get maximumHealth(): number {
    return this.attributes.getAttribute(ContractAttributeType.maximumHealth, []).value;
  }

  public get maximumMana(): number {
    return this.attributes.getAttribute(ContractAttributeType.maximumMana, []).value;
  }

  public get isAlive(): boolean { return this.currentHealth > 0; }
}