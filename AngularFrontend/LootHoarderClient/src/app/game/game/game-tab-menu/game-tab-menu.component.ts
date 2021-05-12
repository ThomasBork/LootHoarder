import { Component, Input, OnInit } from '@angular/core';
import { Game } from '../client-representation/game';
import { GameTabName } from '../client-representation/game-tab-name';
import { UIState } from '../client-representation/ui-state';
import { UIStateManager } from '../ui-state-manager';

@Component({
  selector: 'app-game-tab-menu',
  templateUrl: './game-tab-menu.component.html',
  styleUrls: ['./game-tab-menu.component.scss']
})
export class GameTabMenuComponent {
  public constructor(
    private readonly uiStateManager: UIStateManager
  ) { }

  public get isOnWorldTab(): boolean { return this.uiStateManager.state.selectedTabName === GameTabName.world; }
  public get isOnHeroesTab(): boolean { return this.uiStateManager.state.selectedTabName === GameTabName.heroes; }
  public get isOnCombatTab(): boolean { return this.uiStateManager.state.selectedTabName === GameTabName.combat; }
  public get isOnItemsTab(): boolean { return this.uiStateManager.state.selectedTabName === GameTabName.items; }
  public get isOnSettingsTab(): boolean { return this.uiStateManager.state.selectedTabName === GameTabName.settings; }

  public goToWorldTab(): void {
    this.uiStateManager.state.selectTab(GameTabName.world);
  }

  public goToHeroesTab(): void {
    this.uiStateManager.state.selectTab(GameTabName.heroes);
  }

  public goToCombatTab(): void {
    this.uiStateManager.state.selectTab(GameTabName.combat);
  }

  public goToItemsTab(): void {
    this.uiStateManager.state.selectTab(GameTabName.items);
  }

  public goToSettingsTab(): void {
    this.uiStateManager.state.selectTab(GameTabName.settings);
  }
}
