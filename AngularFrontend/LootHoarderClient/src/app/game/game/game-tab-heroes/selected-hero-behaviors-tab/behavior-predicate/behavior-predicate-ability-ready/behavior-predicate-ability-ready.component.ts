import { Component, Input } from '@angular/core';
import { CharacterBehaviorPredicateAbilityReady } from 'src/app/game/game/client-representation/character-behavior/character-behavior-predicate-ability-ready';
import { Hero } from 'src/app/game/game/client-representation/hero';
import { HeroAbility } from 'src/app/game/game/client-representation/hero-ability';

@Component({
  selector: 'app-behavior-predicate-ability-ready',
  templateUrl: './behavior-predicate-ability-ready.component.html',
  styleUrls: ['./behavior-predicate-ability-ready.component.scss']
})
export class BehaviorPredicateAbilityReadyComponent {
  @Input()
  public predicate!: CharacterBehaviorPredicateAbilityReady;

  @Input()
  public hero!: Hero;

  public get ability(): HeroAbility { return this.predicate.ability; }
  public get allAbilities(): HeroAbility[] { return this.hero.abilities; }
}
