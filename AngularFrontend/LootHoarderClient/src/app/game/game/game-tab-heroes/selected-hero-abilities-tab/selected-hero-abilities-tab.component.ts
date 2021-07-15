import { Component, Input } from '@angular/core';
import { AbilityTagService } from 'src/app/shared/ability-tag.service';
import { NumberPrinter } from 'src/app/shared/number-printer';
import { AbilityTextService } from '../../ability-text-service';
import { AbilityEffect } from '../../client-representation/ability-effect';
import { Hero } from '../../client-representation/hero';
import { HeroAbility } from '../../client-representation/hero-ability';

@Component({
  selector: 'app-selected-hero-abilities-tab',
  templateUrl: './selected-hero-abilities-tab.component.html',
  styleUrls: ['./selected-hero-abilities-tab.component.scss']
})
export class SelectedHeroAbilitiesTabComponent {
  @Input()
  public hero!: Hero;

  public constructor(
    private readonly abilityTagService: AbilityTagService,
    private readonly abilityTextService: AbilityTextService
  ) { }

  public getAbilityEffectDescription(effect: AbilityEffect): string {
    return this.abilityTextService.getAbilityEffectDescription(effect);
  }

  public getAbilityTagColor(tag: string): string {
    return this.abilityTagService.getColor(tag);
  }

  public getAbilityTagTranslation(tag: string): string {
    return this.abilityTagService.translate(tag);
  }

  public toggleIsEnabled(ability: HeroAbility): void {
    ability.isEnabled = !ability.isEnabled;
  }

  public getNumberInSeconds(number: number): string {
    return NumberPrinter.printFloorOnNthDecimal(number / 1000, 1);
  }

  public getNumberInPercent(number: number): string {
    return NumberPrinter.printFloorOnNthDecimal(number * 100, 0);
  }
}
