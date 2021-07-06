import { Component, Input } from '@angular/core';
import { CharacterBehaviorPredicateNot } from 'src/app/game/game/client-representation/character-behavior/character-behavior-predicate-not';
import { CharacterBehaviorPredicateOr } from 'src/app/game/game/client-representation/character-behavior/character-behavior-predicate-or';
import { Hero } from 'src/app/game/game/client-representation/hero';

@Component({
  selector: 'app-behavior-predicate-not',
  templateUrl: './behavior-predicate-not.component.html',
  styleUrls: ['./behavior-predicate-not.component.scss']
})
export class BehaviorPredicateNotComponent {
  @Input()
  public predicate!: CharacterBehaviorPredicateNot;

  @Input()
  public hero!: Hero;
}
