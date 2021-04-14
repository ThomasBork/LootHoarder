import { Component, Input } from '@angular/core';
import { Game } from '../client-representation/game';

@Component({
  selector: 'app-game-tab-heroes',
  templateUrl: './game-tab-heroes.component.html',
  styleUrls: ['./game-tab-heroes.component.scss']
})
export class GameTabHeroesComponent {
  @Input()
  public game!: Game;

  public isCreatingNewHero: boolean = false;

  public openCreateNewHero(): void {
    this.isCreatingNewHero = true;
  }

  public closeCreateNewHero(): void {
    this.isCreatingNewHero = false;
  }
}
