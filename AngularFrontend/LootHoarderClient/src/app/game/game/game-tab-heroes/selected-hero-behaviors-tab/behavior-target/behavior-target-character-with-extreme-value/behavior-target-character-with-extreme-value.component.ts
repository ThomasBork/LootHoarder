import { Component, Input } from '@angular/core';
import { CharacterBehaviorTargetCharacterWithExtremeValue } from 'src/app/game/game/client-representation/character-behavior/character-behavior-target-character-with-extreme-value';
import { CharacterBehaviorTargetRandomCharacter } from 'src/app/game/game/client-representation/character-behavior/character-behavior-target-random-character';

@Component({
  selector: 'app-behavior-target-character-with-extreme-value',
  templateUrl: './behavior-target-character-with-extreme-value.component.html',
  styleUrls: ['./behavior-target-character-with-extreme-value.component.scss']
})
export class BehaviorTargetCharacterWithExtremeValueComponent {
  @Input()
  public target!: CharacterBehaviorTargetCharacterWithExtremeValue;

  public get text(): string {
    const relationText = this.target.matchLeastValue ? 'least' : 'most';
    if (this.isTargetingAlliesOnly) {
      return 'The ally with ' + relationText;
    }
    if (this.isTargetingEnemiesOnly) {
      return 'The enemy with ' + relationText;
    }
    if (this.isTargetingAnyCharacter) {
      return 'The character with ' + relationText;
    }
    throw Error (`Invalid state for character behavior target`);
  }

  private get isTargetingAlliesOnly(): boolean { return this.target.canTargetAllies && !this.target.canTargetEnemies; }
  private get isTargetingEnemiesOnly(): boolean { return !this.target.canTargetAllies && this.target.canTargetEnemies; }
  private get isTargetingAnyCharacter(): boolean { return this.target.canTargetAllies && this.target.canTargetEnemies; }

  public selectRelationLeast(): void {
    this.target.matchLeastValue = true;
  }

  public selectRelationMost(): void {
    this.target.matchLeastValue = false;
  }
}
