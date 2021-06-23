import { Component, Input, OnInit } from '@angular/core';
import { Game } from '../client-representation/game';
import { Hero } from '../client-representation/hero';
import { Item } from '../client-representation/item';
import { UIStateManager } from '../ui-state-manager';

@Component({
  selector: 'app-game-tab-heroes',
  templateUrl: './game-tab-heroes.component.html',
  styleUrls: ['./game-tab-heroes.component.scss']
})
export class GameTabHeroesComponent {
  public isCreatingNewHero: boolean = false;
  public draggedItem?: Item;

  public constructor(
    private readonly uiStateManager: UIStateManager
  ) {}

  public get game(): Game { return this.uiStateManager.state.game; }

  public get numberOfAvailableHeroSlots(): number {
    return this.game.maximumAmountOfHeroes - this.game.heroes.length;
  }

  public get selectedHero(): Hero | undefined { return this.uiStateManager.state.heroesTab.selectedHero; }

  public openCreateNewHero(): void {
    this.isCreatingNewHero = true;
  }

  public closeCreateNewHero(): void {
    this.isCreatingNewHero = false;
  }

  public selectHero(hero: Hero): void {
    this.uiStateManager.state.heroesTab.selectedHero = hero;
  }

  public setDraggedItem(item: Item | undefined): void {
    this.draggedItem = item;
  }
}
