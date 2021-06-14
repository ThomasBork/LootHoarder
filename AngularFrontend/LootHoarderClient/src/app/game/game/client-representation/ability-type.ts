import { AbilityTypeEffect } from "./ability-type-effect";

export class AbilityType {
  public key: string;
  public name: string;
  public description: string;
  public tags: string[];
  public effects: AbilityTypeEffect[];

  public constructor(
    key: string,
    name: string,
    description: string,
    tags: string[],
    effects: AbilityTypeEffect[]
  ) {
    this.key = key;
    this.name = name;
    this.description = description;
    this.tags = tags;
    this.effects = effects;
  }
}