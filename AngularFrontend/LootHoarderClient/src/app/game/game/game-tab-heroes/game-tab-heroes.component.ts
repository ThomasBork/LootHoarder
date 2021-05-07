import { Component, Input } from '@angular/core';
import { Game } from '../client-representation/game';
import { Hero } from '../client-representation/hero';
import { Item } from '../client-representation/item';

@Component({
  selector: 'app-game-tab-heroes',
  templateUrl: './game-tab-heroes.component.html',
  styleUrls: ['./game-tab-heroes.component.scss']
})
export class GameTabHeroesComponent {
  @Input()
  public game!: Game;

  public isCreatingNewHero: boolean = false;
  public selectedHero?: Hero;
  public draggedItem?: Item;

  public openCreateNewHero(): void {
    this.isCreatingNewHero = true;
  }

  public closeCreateNewHero(): void {
    this.isCreatingNewHero = false;
  }

  public selectHero(hero: Hero): void {
    this.selectedHero = hero;
  }

  public setDraggedItem(item: Item | undefined): void {
    this.draggedItem = item;
  }
}
