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

  public getAbilityUsageBarColor(): string {
    const isSpell = this.character.abilityBeingUsed?.type.tags.includes('spell');
    const isAttack = this.character.abilityBeingUsed?.type.tags.includes('attack');
    if (isSpell) {
      return '#FF0088';
    }

    if (isAttack) {
      return '#88FF00';
    }

    return '00FF88';
  }
}
