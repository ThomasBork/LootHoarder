import { Component, Input } from '@angular/core';
import { CharacterBehaviorValueRemainingCooldownOfAbility } from 'src/app/game/game/client-representation/character-behavior/character-behavior-value-remaining-cooldown-of-ability';
import { Hero } from 'src/app/game/game/client-representation/hero';
import { HeroAbility } from 'src/app/game/game/client-representation/hero-ability';

@Component({
  selector: 'app-behavior-value-remaining-cooldown-of-ability',
  templateUrl: './behavior-value-remaining-cooldown-of-ability.component.html',
  styleUrls: ['./behavior-value-remaining-cooldown-of-ability.component.scss']
})
export class BehaviorValueRemainingCooldownOfAbilityComponent {
  @Input()
  public value!: CharacterBehaviorValueRemainingCooldownOfAbility;

  @Input()
  public hero!: Hero;

  public get allAbilities(): HeroAbility[] {
    return this.hero.abilities;
  }
}
