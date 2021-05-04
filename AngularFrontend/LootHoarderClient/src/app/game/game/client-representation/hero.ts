import { AreaHero } from "./area-hero";
import { AttributeSetValues } from "./attribute-set-values";
import { HeroType } from "./hero-type";

export class Hero {
  public id: number;
  public type: HeroType;
  public name: string;
  public level: number;
  public experience: number;
  public areaHero?: AreaHero;
  public attributes: AttributeSetValues;

  public constructor(
    id: number,
    type: HeroType,
    name: string,
    level: number,
    experience: number,
    attributes: AttributeSetValues,
  ) {
    this.id = id;
    this.type = type;
    this.name = name;
    this.level = level;
    this.experience = experience;
    this.attributes = attributes;
  }
}
