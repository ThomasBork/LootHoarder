import { AbilityEffect } from "./ability-effect";
import { AbilityType } from "./ability-type";

export class HeroAbility {
  public id: number;
  public type: AbilityType;
  public isEnabled: boolean;
  public effects: AbilityEffect[];
  public useSpeed: number;
  public cooldownSpeed: number;
  public cooldown: number;
  public manaCost: number;
  public criticalStrikeChance: number;
  public timeToUse: number;

  public constructor(
    id: number,
    type: AbilityType,
    isEnabled: boolean,
    effects: AbilityEffect[],
    useSpeed: number,
    cooldownSpeed: number,
    cooldown: number,
    manaCost: number,
    criticalStrikeChance: number,
    timeToUse: number,
  ) {
    this.id = id;
    this.type = type;
    this.isEnabled = isEnabled;
    this.effects = effects;
    this.useSpeed = useSpeed;
    this.cooldownSpeed = cooldownSpeed;
    this.cooldown = cooldown;
    this.manaCost = manaCost;
    this.criticalStrikeChance = criticalStrikeChance;
    this.timeToUse = timeToUse;
  }
}
