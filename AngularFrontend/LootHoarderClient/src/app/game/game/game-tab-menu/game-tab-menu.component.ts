import { Component, Input, OnInit } from '@angular/core';
import { Game } from '../client-representation/game';
import { UIState } from '../client-representation/ui-state';

@Component({
  selector: 'app-game-tab-menu',
  templateUrl: './game-tab-menu.component.html',
  styleUrls: ['./game-tab-menu.component.scss']
})
export class GameTabMenuComponent implements OnInit {
  @Input()
  public uiState!: UIState;

  public selectedTab!: string;

  public constructor(
  ) { }

  public ngOnInit(): void {
    if (this.uiState.game.heroes.length === 0) {
      this.selectedTab = 'heroes';
    } else {
      this.selectedTab = 'world';
    }
  }

  public changeTab(tabName: string): void {
    this.selectedTab = tabName;
  }
}
