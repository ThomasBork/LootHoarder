import { AbilityTypeEffect } from "./ability-type-effect";

export class AbilityType {
  public key: string;
  public name: string;
  public tags: string[];
  public manaCost: number;
  public timeToUse: number;
  public cooldown: number;
  public criticalStrikeChance: number;
  public effects: AbilityTypeEffect[];

  public constructor(
    key: string,
    name: string,
    tags: string[],
    manaCost: number,
    timeToUse: number,
    cooldown: number,
    criticalStrikeChance: number,
    effects: AbilityTypeEffect[],
  ) {
    this.key = key;
    this.name = name;
    this.tags = tags;
    this.manaCost = manaCost;
    this.timeToUse = timeToUse;
    this.cooldown = cooldown;
    this.criticalStrikeChance = criticalStrikeChance;
    this.effects = effects;
  }
}