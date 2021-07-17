import { Component, Input } from '@angular/core';
import { AbilityTagService } from 'src/app/shared/ability-tag.service';
import { AttributeTypeTranslator } from 'src/app/shared/attribute-type-translator';
import { Attribute } from '../../client-representation/attribute';
import { Hero } from '../../client-representation/hero';

@Component({
  selector: 'app-hero-information',
  templateUrl: './hero-information.component.html',
  styleUrls: ['./hero-information.component.scss']
})
export class HeroInformationComponent {
  @Input()
  public hero!: Hero;

  public constructor(
    private readonly abilityTagService: AbilityTagService
  ) {

  }

  public getLabel(attribute: Attribute): string {
    const tagText = attribute.tags.length > 0 ? attribute.tags.map(t => this.abilityTagService.translate(t)).join(' ') + ' ' : '';
    const typeText = AttributeTypeTranslator.translate(attribute.type);
    return `${tagText}${typeText}`;
  }

  public getMultiplicativeValue(attribute: Attribute): string {
    const changeInPercent = (attribute.multiplicativeValue - 1) * 100;
    const prettyChangeInPercent = Math.round(changeInPercent);
    if (changeInPercent > 0) {
      return `+${prettyChangeInPercent}%`;
    } else {
      return `-${prettyChangeInPercent}%`;
    }
  }
}
