import { ContractCombatCharacterAbility } from "src/loot-hoarder-contract/contract-combat-character-ability";
import { DbAbility } from "src/raw-game-state/db-ability";
import { StaticGameContentService } from "src/services/static-game-content-service";
import { AbilityType } from "../ability-type";
import { ValueContainer } from "../value-container";
import { AbilityEffect } from "./ability-effect";

export class Ability {
  public type: AbilityType;
  public effects: AbilityEffect[];
  public useSpeedVC: ValueContainer;
  public cooldownSpeedVC: ValueContainer;
  public cooldownVC: ValueContainer;
  public manaCostVC: ValueContainer;
  public criticalStrikeChanceVC: ValueContainer;
  public timeToUseVC: ValueContainer;
  
  private dbModel: DbAbility;

  public constructor(
    dbModel: DbAbility,
    type: AbilityType
  ) {
    this.dbModel = dbModel;
    this.type = type;

    this.effects = type.effects.map(effect => new AbilityEffect(effect));

    this.useSpeedVC = new ValueContainer(0);
    this.cooldownSpeedVC = new ValueContainer(0);
    this.manaCostVC = new ValueContainer(type.manaCost);
    this.criticalStrikeChanceVC = new ValueContainer(type.criticalStrikeChance);

    this.timeToUseVC = new ValueContainer(type.timeToUse);
    // Use speed should never reach 0 except during setup.
    this.timeToUseVC.setMultiplicativeValueContainer(this.useSpeedVC, value => value ? 100 / value : 1);
    
    this.cooldownVC = new ValueContainer(type.cooldown);
    // Cooldown speed should never reach 0 except during setup.
    this.cooldownVC.setMultiplicativeValueContainer(this.cooldownSpeedVC, value => value ? 100 / value : 1);
  }

  public get id(): number { return this.dbModel.id; }
  public get isReady(): boolean { 
    return this.dbModel.remainingCooldown === 0
  }
  public get remainingCooldown(): number { return this.dbModel.remainingCooldown; }
  public set remainingCooldown(newValue: number) { 
    if (newValue < 0) {
      newValue = 0;
    }
    this.dbModel.remainingCooldown = newValue;
  }

  public startCooldown(): void {
    this.dbModel.remainingCooldown = this.cooldownVC.value;
  }

  public getUIState(): ContractCombatCharacterAbility {
    return {
      id: this.dbModel.id,
      typeKey: this.dbModel.typeKey,
      cooldown: this.cooldownVC.value,
      remainingCooldown: this.dbModel.remainingCooldown
    };
  }

  public static load(dbModel: DbAbility): Ability {
    const type = StaticGameContentService.instance.getAbilityType(dbModel.typeKey);
    const ability = new Ability(dbModel, type);
    return ability;
  }
}
