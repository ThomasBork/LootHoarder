import { Component, Input } from '@angular/core';
import { Hero } from '../../client-representation/hero';

@Component({
  selector: 'app-hero-information',
  templateUrl: './hero-information.component.html',
  styleUrls: ['./hero-information.component.scss']
})
export class HeroInformationComponent {
  @Input()
  public hero!: Hero;
}
