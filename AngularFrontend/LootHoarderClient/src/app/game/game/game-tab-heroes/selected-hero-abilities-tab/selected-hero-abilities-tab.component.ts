import { Component, Input } from '@angular/core';
import { Hero } from '../../client-representation/hero';

@Component({
  selector: 'app-selected-hero-abilities-tab',
  templateUrl: './selected-hero-abilities-tab.component.html',
  styleUrls: ['./selected-hero-abilities-tab.component.scss']
})
export class SelectedHeroAbilitiesTabComponent {
  @Input()
  public hero!: Hero;
}
