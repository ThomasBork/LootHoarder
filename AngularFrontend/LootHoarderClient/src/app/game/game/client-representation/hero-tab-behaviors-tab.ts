import { CharacterBehavior } from "./character-behavior/character-behavior";
import { HeroTab } from "./hero-tab";
import { HeroTabChildTab } from "./hero-tab-child-tab";

export class HeroTabBehaviorsTab extends HeroTabChildTab {
  public selectedBehavior?: CharacterBehavior;
  public constructor(
    parentTab: HeroTab
  ) {
    super(parentTab, 'behaviors', 'Behaviors');

    this.onOpen.subscribe(() => this.selectBehaviorForSelectedHero());
  }

  private selectBehaviorForSelectedHero(): void {
    const hero = (this.parentTab as HeroTab).selectedHero;

    if (!hero) {
      throw Error (`Cannot open the ${this.name} tab without selecting a hero first.`);
    }

    if (
      hero.behaviors.length > 0
      && (
        !this.selectedBehavior
        || !hero.behaviors.includes(this.selectedBehavior)
      )
    ) {
      this.selectedBehavior = hero.behaviors[0];
    }
  }
}