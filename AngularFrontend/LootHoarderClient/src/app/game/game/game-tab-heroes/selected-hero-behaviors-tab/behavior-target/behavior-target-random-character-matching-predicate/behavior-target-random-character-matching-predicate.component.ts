import { Component, Input } from '@angular/core';
import { CharacterBehaviorTargetRandomCharacterMatchingPredicate } from 'src/app/game/game/client-representation/character-behavior/character-behavior-target-random-character-matching-predicate';

@Component({
  selector: 'app-behavior-target-random-character-matching-predicate',
  templateUrl: './behavior-target-random-character-matching-predicate.component.html',
  styleUrls: ['./behavior-target-random-character-matching-predicate.component.scss']
})
export class BehaviorTargetRandomCharacterMatchingPredicateComponent {
  @Input()
  public target!: CharacterBehaviorTargetRandomCharacterMatchingPredicate;

  public get targetText(): string {
    if (this.isTargetingAlliesOnly) {
      return 'Random ally'
    }
    if (this.isTargetingEnemiesOnly) {
      return 'Random enemy'
    }
    if (this.isTargetingAnyCharacter) {
      return 'Random character'
    }
    throw Error (`Invalid state for character behavior target`);
  }

  private get isTargetingAlliesOnly(): boolean { return this.target.canTargetAllies && !this.target.canTargetEnemies; }
  private get isTargetingEnemiesOnly(): boolean { return !this.target.canTargetAllies && this.target.canTargetEnemies; }
  private get isTargetingAnyCharacter(): boolean { return this.target.canTargetAllies && this.target.canTargetEnemies; }
}
