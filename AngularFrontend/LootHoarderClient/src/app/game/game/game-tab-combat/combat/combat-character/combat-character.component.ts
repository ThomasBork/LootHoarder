import { Component, Input, OnInit } from '@angular/core';
import { CombatCharacter } from '../../../client-representation/combat-character';

@Component({
  selector: 'app-combat-character',
  templateUrl: './combat-character.component.html',
  styleUrls: ['./combat-character.component.scss']
})
export class CombatCharacterComponent {
  @Input()
  public character!: CombatCharacter;

  public getImagePath(): string {
    return `assets/images/${this.character.typeKey}.png`;
  }
}
