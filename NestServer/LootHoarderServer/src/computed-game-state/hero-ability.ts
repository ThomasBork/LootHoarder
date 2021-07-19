import { DbHeroAbility } from "src/raw-game-state/db-hero-ability";
import { StaticGameContentService } from "src/services/static-game-content-service";
import { AbilityType } from "./ability-type";
import { ContractHeroAbility } from "src/loot-hoarder-contract/contract-hero-ability";
import { AbilityEffect } from "./ability-effect";
import { ValueContainer } from "./value-container";

export class HeroAbility {
  private dbModel: DbHeroAbility;
  public type: AbilityType;
  public effects: AbilityEffect[];
  public useSpeedVC: ValueContainer;
  public cooldownSpeedVC: ValueContainer;
  public cooldownVC: ValueContainer;
  public manaCostVC: ValueContainer;
  public criticalStrikeChanceVC: ValueContainer;
  public criticalStrikeMultiplierVC: ValueContainer;
  public timeToUseVC: ValueContainer;

  private constructor(
    dbModel: DbHeroAbility,
    type: AbilityType
  ) {
    this.dbModel = dbModel;
    this.type = type;

    this.effects = type.effects.map(effect => new AbilityEffect(type, effect));

    this.useSpeedVC = new ValueContainer(0);
    this.cooldownSpeedVC = new ValueContainer(0);
    this.manaCostVC = new ValueContainer(type.manaCost);
    this.criticalStrikeChanceVC = new ValueContainer(type.criticalStrikeChance);
    this.criticalStrikeMultiplierVC = new ValueContainer(0);

    this.timeToUseVC = new ValueContainer(type.timeToUse);
    // Use speed should never reach 0 except during setup.
    this.timeToUseVC.setMultiplicativeValueContainer(this.useSpeedVC, value => value ? 100 / value : 1);
    
    this.cooldownVC = new ValueContainer(type.cooldown);
    // Cooldown speed should never reach 0 except during setup.
    this.cooldownVC.setMultiplicativeValueContainer(this.cooldownSpeedVC, value => value ? 100 / value : 1);
  }

  public get id(): number { return this.dbModel.id; }
  public get isEnabled(): boolean { return this.dbModel.isEnabled; }

  public toContractModel(): ContractHeroAbility {
    return {
      id: this.id,
      isEnabled: this.isEnabled,
      typeKey: this.type.key,
      cooldown: this.cooldownVC.value,
      cooldownSpeed: this.cooldownSpeedVC.value,
      criticalStrikeChance: this.criticalStrikeChanceVC.value,
      criticalStrikeMultiplier: this.criticalStrikeMultiplierVC.value,
      manaCost: this.manaCostVC.value,
      timeToUse: this.timeToUseVC.value,
      useSpeed: this.useSpeedVC.value,
      effects: this.effects.map(effect => effect.toContractModel())
    };
  }

  public static load(dbModel: DbHeroAbility): HeroAbility {
    const abilityType = StaticGameContentService.instance.getAbilityType(dbModel.typeKey);
    return new HeroAbility(dbModel, abilityType);
  }
}
