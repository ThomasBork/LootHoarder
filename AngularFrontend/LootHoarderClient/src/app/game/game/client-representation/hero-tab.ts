import { ContractGameTabKey } from "src/loot-hoarder-contract/contract-game-tab-key";
import { HeroTabChildTab } from "./hero-tab-child-tab";
import { Hero } from "./hero";
import { GameTab } from "./game-tab";

export class HeroTab extends GameTab {
  public selectedHero?: Hero;
  
  public selectedTab: HeroTabChildTab;

  public itemsTab: HeroTabChildTab;
  public abilitiesTab: HeroTabChildTab;
  public passivesTab: HeroTabChildTab;
  public managementTab: HeroTabChildTab;

  public allTabs: HeroTabChildTab[];

  public constructor() {
    super(undefined, ContractGameTabKey.heroes, 'Heroes');

    this.selectedHero = undefined;

    this.itemsTab = new HeroTabChildTab(this, 'items', 'Items');
    this.abilitiesTab = new HeroTabChildTab(this, 'abilities', 'Abilities');
    this.passivesTab = new HeroTabChildTab(this, 'passives', 'Passives');
    this.managementTab = new HeroTabChildTab(this, 'management', 'management');

    this.allTabs = [this.itemsTab, this.abilitiesTab, this.passivesTab, this.managementTab];

    this.selectedTab = this.itemsTab;
  }
}