import { ContinuousEffectType } from "./continuous-effect-type";
import { PassiveAbility } from "./passive-ability";

export class ContinuousEffect {
  public id: number;
  public type: ContinuousEffectType;
  public abilities: PassiveAbility[];
  public timeRemaining: number;
  public lastsIndefinitely: boolean;
  public constructor(
    id: number,
    type: ContinuousEffectType,
    abilities: PassiveAbility[],
    timeRemaining: number,
    lastsIndefinitely: boolean,
  ) {
    this.id = id;
    this.type = type;
    this.abilities = abilities;
    this.timeRemaining = timeRemaining;
    this.lastsIndefinitely = lastsIndefinitely;
  }

  public get abilityDescription(): string[] {
    return this.abilities.map(ability => ability.description);
  }
}
