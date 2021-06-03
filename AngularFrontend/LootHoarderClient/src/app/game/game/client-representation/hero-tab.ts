import { AreaType } from "./area-type";
import { Hero } from "./hero";

export class HeroTab {
  public selectedHero?: Hero;

  public constructor() {
    this.selectedHero = undefined;
  }
}