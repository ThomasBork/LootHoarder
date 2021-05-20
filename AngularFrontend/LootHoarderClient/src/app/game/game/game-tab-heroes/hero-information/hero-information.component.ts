import { Component, Input } from '@angular/core';
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

  public getLabel(attribute: Attribute, isAdditive: boolean): string {
    const additiveText = isAdditive ? 'Additive' : 'Multiplicative';
    const tagText = attribute.tags.join(' ') + (attribute.tags.length > 0 ? ' ' : '');
    return `${additiveText} ${tagText}${attribute.type}`;
  }
}
