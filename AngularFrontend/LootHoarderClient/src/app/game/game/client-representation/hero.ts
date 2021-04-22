import { HeroType } from "./hero-type";

export class Hero {
  public id: number;
  public type: HeroType;
  public name: string;
  public level: number;
  public experience: number;

  public constructor(
    id: number,
    type: HeroType,
    name: string,
    level: number,
    experience: number,
  ) {
    this.id = id;
    this.type = type;
    this.name = name;
    this.level = level;
    this.experience = experience;
  }
}
