import { Component, Input } from '@angular/core';
import { Hero } from '../../client-representation/hero';

@Component({
  selector: 'app-selected-hero-passives-tab',
  templateUrl: './selected-hero-passives-tab.component.html',
  styleUrls: ['./selected-hero-passives-tab.component.scss']
})
export class SelectedHeroPassivesTabComponent {
  @Input()
  public hero!: Hero;
}
