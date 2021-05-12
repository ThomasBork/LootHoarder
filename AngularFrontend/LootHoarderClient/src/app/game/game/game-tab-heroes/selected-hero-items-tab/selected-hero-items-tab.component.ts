import { Component, Input } from '@angular/core';
import { Game } from '../../client-representation/game';
import { Hero } from '../../client-representation/hero';
import { Item } from '../../client-representation/item';

@Component({
  selector: 'app-selected-hero-items-tab',
  templateUrl: './selected-hero-items-tab.component.html',
  styleUrls: ['./selected-hero-items-tab.component.scss']
})
export class SelectedHeroItemsTabComponent {
  @Input() 
  public game!: Game;
  @Input()
  public hero!: Hero;

  public draggedItem?: Item;

  public setDraggedItem(item: Item | undefined): void {
    this.draggedItem = item;
  }
}
