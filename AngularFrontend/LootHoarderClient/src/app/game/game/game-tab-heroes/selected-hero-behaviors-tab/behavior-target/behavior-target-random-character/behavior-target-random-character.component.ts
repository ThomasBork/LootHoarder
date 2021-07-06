import { Component, Input } from '@angular/core';
import { CharacterBehaviorTargetRandomCharacter } from 'src/app/game/game/client-representation/character-behavior/character-behavior-target-random-character';

@Component({
  selector: 'app-behavior-target-random-character',
  templateUrl: './behavior-target-random-character.component.html',
  styleUrls: ['./behavior-target-random-character.component.scss']
})
export class BehaviorTargetRandomCharacterComponent {
  @Input()
  public target!: CharacterBehaviorTargetRandomCharacter;

  public get text(): string {
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
