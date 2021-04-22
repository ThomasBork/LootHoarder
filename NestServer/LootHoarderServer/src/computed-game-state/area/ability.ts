import { DbAbility } from "src/raw-game-state/db-ability";
import { StaticGameContentService } from "src/services/static-game-content-service";
import { AbilityType } from "../ability-type";
import { ValueContainer } from "../value-container";

export class Ability {
  public type: AbilityType;
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

    this.manaCostVC = new ValueContainer(type.manaCost);
    this.timeToUseVC = new ValueContainer(type.timeToUse);
    this.cooldownVC = new ValueContainer(type.cooldown);
    this.criticalStrikeChanceVC = new ValueContainer(type.criticalStrikeChance);
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

  public static load(dbModel: DbAbility): Ability {
    const type = StaticGameContentService.instance.getAbilityType(dbModel.typeKey);
    const ability = new Ability(dbModel, type);
    return ability;
  }
}
