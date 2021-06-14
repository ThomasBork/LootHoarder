import { Component, Input } from '@angular/core';
import { AbilityTagService } from 'src/app/shared/ability-tag.service';
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
    private readonly abilityTagService: AbilityTagService
  ) { }

  public getAbilityTagColor(tag: string): string {
    return this.abilityTagService.getColor(tag);
  }

  public getAbilityTagTranslation(tag: string): string {
    return this.abilityTagService.translate(tag);
  }

  public toggleIsEnabled(ability: HeroAbility): void {
    ability.isEnabled = !ability.isEnabled;
  }
}
