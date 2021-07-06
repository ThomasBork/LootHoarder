import { Component, Input } from '@angular/core';
import { CharacterBehaviorTargetSpecificHero } from 'src/app/game/game/client-representation/character-behavior/character-behavior-target-specific-hero';
import { Hero } from 'src/app/game/game/client-representation/hero';
import { UIStateManager } from 'src/app/game/game/ui-state-manager';

@Component({
  selector: 'app-behavior-target-specific-hero',
  templateUrl: './behavior-target-specific-hero.component.html',
  styleUrls: ['./behavior-target-specific-hero.component.scss']
})
export class BehaviorTargetSpecificHeroComponent {
  @Input()
  public target!: CharacterBehaviorTargetSpecificHero;

  public constructor(private readonly uiStateManager: UIStateManager) {

  }

  public get hero(): Hero {
    return this.uiStateManager.state.game.getHero(this.target.heroId);
  }

  public get heroes(): Hero[] {
    return this.uiStateManager.state.game.heroes;
  }

  public selectHero(hero: Hero): void {
    this.target.heroId = hero.id;
  }
}
