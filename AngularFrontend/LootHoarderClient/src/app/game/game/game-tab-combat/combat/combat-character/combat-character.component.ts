import { Component, Input, OnInit } from '@angular/core';
import { AbilityTagTranslator } from 'src/app/shared/ability-tag-translator';
import { CombatCharacter } from '../../../client-representation/combat-character';
import { CombatCharacterAbility } from '../../../client-representation/combat-character-ability';

@Component({
  selector: 'app-combat-character',
  templateUrl: './combat-character.component.html',
  styleUrls: ['./combat-character.component.scss']
})
export class CombatCharacterComponent {
  @Input()
  public character!: CombatCharacter;
  @Input()
  public isTeam1!: boolean;

  public getImagePath(): string {
    return `assets/images/combat-character/${this.character.typeKey}.png`;
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

  public getCooldownOverlayWidthInPercent(ability: CombatCharacterAbility): number {
    return (ability.remainingCooldown / ability.cooldown) * 100;
  }

  public getAbilityTagColor(tag: string): string {
    switch (tag) {
      case "lightning": return 'yellow';
      case "poison": return 'green';
      case "elemental": return 'purple';
      case "spell": return 'purple';
      case "physical": return 'grey';
      case "attack": return 'grey';
      default: return 'white';
    }
  }

  public getTranslatedAbilityTag(tag: string): string {
    return AbilityTagTranslator.translate(tag);
  }
}
