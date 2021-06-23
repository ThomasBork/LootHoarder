import { GameTab } from "./game-tab";
import { HeroTab } from "./hero-tab";

export class HeroTabChildTab extends GameTab {
  public constructor(
    parentTab: HeroTab,
    key: string,
    name: string
  ) {
    super(parentTab, key, name);
  }
}