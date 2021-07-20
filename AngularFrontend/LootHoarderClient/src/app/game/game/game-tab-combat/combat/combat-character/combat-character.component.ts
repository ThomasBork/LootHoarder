import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AbilityTagTranslator } from 'src/app/shared/ability-tag-translator';
import { AbilityTagService } from 'src/app/shared/ability-tag.service';
import { CombatCharacter } from '../../../client-representation/combat-character';
import { CombatCharacterAbility } from '../../../client-representation/combat-character-ability';
import { CombatCharacterFloatingNumber } from '../../../client-representation/combat-character-floating-number';

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

  public constructor(private readonly abilityTagService: AbilityTagService) {}

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
    return this.abilityTagService.getColor(tag);
  }

  public getTranslatedAbilityTag(tag: string): string {
    return this.abilityTagService.translate(tag);
  }

  public getOpacity(floatingNumber: CombatCharacterFloatingNumber): number {
    const percentageTimeLeft = floatingNumber.durationLeft / floatingNumber.totalDuration;
    if (percentageTimeLeft > 0.5) {
      return 1;
    }
    return percentageTimeLeft / 0.5;
  }
}
