import { Component, Input, OnInit } from '@angular/core';
import { Game } from '../client-representation/game';

@Component({
  selector: 'app-game-tab-menu',
  templateUrl: './game-tab-menu.component.html',
  styleUrls: ['./game-tab-menu.component.scss']
})
export class GameTabMenuComponent implements OnInit {
  @Input()
  public game!: Game;

  public selectedTab!: string;

  public constructor(
  ) { }

  public ngOnInit(): void {
    if (this.game.heroes.length === 0) {
      this.selectedTab = 'heroes';
    } else {
      this.selectedTab = 'world';
    }
  }

  public changeTab(tabName: string): void {
    this.selectedTab = tabName;
  }
}
