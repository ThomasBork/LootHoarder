import { AbilityTypeEffect } from "./ability-type-effect";
import { ValueContainer } from "./value-container";

export class AbilityType {
  public key: string;
  public name: string;
  public description: string;
  public tags: string[];
  public manaCost: number;
  public timeToUse: number;
  public cooldown: number;
  public criticalStrikeChance: number;
  public effects: AbilityTypeEffect[];

  public constructor(
    key: string,
    name: string,
    description: string,
    tags: string[],
    manaCost: number,
    timeToUse: number,
    cooldown: number,
    criticalStrikeChance: number,
    effects: AbilityTypeEffect[]
  ) {
    this.key = key;
    this.name = name;
    this.description = description;
    this.tags = tags;
    this.manaCost = manaCost;
    this.timeToUse = timeToUse;
    this.cooldown = cooldown;
    this.criticalStrikeChance = criticalStrikeChance;
    this.effects = effects;
  }

  public get requiresTarget(): boolean {
    return this.effects.every(effect => effect.requiresTarget);
  }

  public get canTargetAllies(): boolean {
    return this.effects.every(effect => 
      !effect.requiresTarget 
      || effect.canTargetAllies
    );
  }

  public get canTargetEnemies(): boolean {
    return this.effects.every(effect => 
      !effect.requiresTarget 
      || effect.canTargetEnemies
    );
  }

  public get isAttack(): boolean {
    return this.tags.includes('attack');
  }

  public get isSpell(): boolean {
    return this.tags.includes('spell');
  }
}