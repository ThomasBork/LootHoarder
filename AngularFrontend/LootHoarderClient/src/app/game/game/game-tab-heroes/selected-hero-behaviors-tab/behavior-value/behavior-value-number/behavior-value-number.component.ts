import { Component, Input } from '@angular/core';
import { CharacterBehaviorValueNumber } from 'src/app/game/game/client-representation/character-behavior/character-behavior-value-number';

@Component({
  selector: 'app-behavior-value-number',
  templateUrl: './behavior-value-number.component.html',
  styleUrls: ['./behavior-value-number.component.scss']
})
export class BehaviorValueNumberComponent {
  @Input()
  public value!: CharacterBehaviorValueNumber;
}
