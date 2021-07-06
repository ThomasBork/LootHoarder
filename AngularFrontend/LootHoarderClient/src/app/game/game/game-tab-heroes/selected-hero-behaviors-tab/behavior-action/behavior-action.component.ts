import { Component, Input } from '@angular/core';
import { CharacterBehaviorAction } from '../../../client-representation/character-behavior/character-behavior-action';
import { CharacterBehaviorPredicateAbilityReady } from '../../../client-representation/character-behavior/character-behavior-predicate-ability-ready';
import { CharacterBehaviorTarget } from '../../../client-representation/character-behavior/character-behavior-target';
import { Hero } from '../../../client-representation/hero';

@Component({
  selector: 'app-behavior-action',
  templateUrl: './behavior-action.component.html',
  styleUrls: ['./behavior-action.component.scss']
})
export class BehaviorActionComponent {
  @Input()
  public action!: CharacterBehaviorAction;

  @Input()
  public hero!: Hero;

  public addPredicate(): void {
    this.action.predicate = new CharacterBehaviorPredicateAbilityReady(this.action.ability);
  }

  public setTarget(target: CharacterBehaviorTarget): void {
    this.action.target = target;
  }
}
