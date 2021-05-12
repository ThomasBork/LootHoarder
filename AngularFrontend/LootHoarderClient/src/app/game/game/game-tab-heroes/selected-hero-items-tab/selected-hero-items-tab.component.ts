import { Component, Input } from '@angular/core';
import { Game } from '../../client-representation/game';
import { Hero } from '../../client-representation/hero';
import { Item } from '../../client-representation/item';
import { UIStateManager } from '../../ui-state-manager';

@Component({
  selector: 'app-selected-hero-items-tab',
  templateUrl: './selected-hero-items-tab.component.html',
  styleUrls: ['./selected-hero-items-tab.component.scss']
})
export class SelectedHeroItemsTabComponent {
  @Input()
  public hero!: Hero;

  public draggedItem?: Item;

  public constructor(
    private readonly uiStateManager: UIStateManager
  ) {}

  public get items(): Item[] { return this.uiStateManager.state.game.items; }

  public setDraggedItem(item: Item | undefined): void {
    this.draggedItem = item;
  }
}
