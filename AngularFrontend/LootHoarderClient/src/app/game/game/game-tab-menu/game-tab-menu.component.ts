import { Component, Input, OnInit } from '@angular/core';
import { ContractGameTabKey } from 'src/loot-hoarder-contract/contract-game-tab-key';
import { GameTab } from '../client-representation/game-tab';
import { UIStateManager } from '../ui-state-manager';

@Component({
  selector: 'app-game-tab-menu',
  templateUrl: './game-tab-menu.component.html',
  styleUrls: ['./game-tab-menu.component.scss']
})
export class GameTabMenuComponent {
  public constructor(
    private readonly uiStateManager: UIStateManager
  ) {  }

  public get alwaysShowChat(): boolean { return this.uiStateManager.state.game.settings.alwaysShowChat; }
  
  public get worldTab(): GameTab {
    return this.uiStateManager.state.worldTab;
  }
  public get heroesTab(): GameTab {
    return this.uiStateManager.state.heroesTab;
  }
  public get combatTab(): GameTab {
    return this.uiStateManager.state.combatTab;
  }
  public get itemsTab(): GameTab {
    return this.uiStateManager.state.itemsTab;
  }
  public get questsTab(): GameTab {
    return this.uiStateManager.state.questsTab;
  }
  public get achievementsTab(): GameTab {
    return this.uiStateManager.state.achievementsTab;
  }
  public get settingsTab(): GameTab {
    return this.uiStateManager.state.settingsTab;
  }
  public get socialTab(): GameTab {
    return this.uiStateManager.state.socialTab;
  }

  public get selectedTab(): GameTab {
    return this.uiStateManager.state.selectedTab;
  }
  public set selectedTab(tab: GameTab) {
    this.uiStateManager.state.selectedTab = tab;
  }
}
