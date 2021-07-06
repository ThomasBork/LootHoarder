import { Component, Input, OnInit } from '@angular/core';
import { ContractGameTabKey } from 'src/loot-hoarder-contract/contract-game-tab-key';
import { Hero } from '../../client-representation/hero';
import { UIStateManager } from '../../ui-state-manager';
import { HeroTabChildTab } from '../../client-representation/hero-tab-child-tab';

@Component({
  selector: 'app-selected-hero-tab-menu',
  templateUrl: './selected-hero-tab-menu.component.html',
  styleUrls: ['./selected-hero-tab-menu.component.scss']
})
export class SelectedHeroTabMenuComponent {
  @Input()
  public hero!: Hero;

  public get selectedTab(): HeroTabChildTab{
    return this.uiStateManager.state.heroesTab.selectedTab;
  }
  public get itemsTab(): HeroTabChildTab{
    return this.uiStateManager.state.heroesTab.itemsTab;
  }
  public get abilitiesTab(): HeroTabChildTab{
    return this.uiStateManager.state.heroesTab.abilitiesTab;
  }
  public get passivesTab(): HeroTabChildTab{
    return this.uiStateManager.state.heroesTab.passivesTab;
  }
  public get behaviorsTab(): HeroTabChildTab{
    return this.uiStateManager.state.heroesTab.behaviorsTab;
  }
  public get managementTab(): HeroTabChildTab{
    return this.uiStateManager.state.heroesTab.managementTab;
  }

  public constructor(private readonly uiStateManager: UIStateManager) {
  }

  public changeTab(tab: HeroTabChildTab): void {
    this.uiStateManager.state.heroesTab.selectedTab = tab;
    tab.onOpen.next();
  }
}
