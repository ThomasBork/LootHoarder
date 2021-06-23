import { AfterContentInit, Component, ContentChildren, EventEmitter, Input, Output, QueryList } from "@angular/core";
import { GameTab } from "src/app/game/game/client-representation/game-tab";
import { TabComponent } from "./tab/tab.component";

@Component({
  selector: 'app-tab-menu',
  templateUrl: './tab-menu.component.html',
  styleUrls: ['./tab-menu.component.scss']
})
export class TabMenuComponent implements AfterContentInit {
  @ContentChildren(TabComponent) 
  public tabComponents: QueryList<TabComponent> = new QueryList();

  public tabs: GameTab[] = [];

  @Input()
  public set selectedTab(tab: GameTab | undefined) {
    if (this.tabComponents.length === 0) {
      this._selectedTab = tab;
    } else if (tab) {
      if (this.selectedTab !== tab) {
        this.selectTab(tab);
      }
    }
  }
  public get selectedTab(): GameTab | undefined {
    return this._selectedTab;
  }

  @Output()
  public selectedTabChange: EventEmitter<GameTab> = new EventEmitter();

  private _selectedTab?: GameTab;

  public ngAfterContentInit(): void {
    this.tabs = this.tabComponents.map(component => component.tab);
    if (this.selectedTab) {
      this.selectTab(this.selectedTab);
    } else {
      const enabledTabs = this.tabs.filter(tab => tab.isEnabled);
      this.selectTab(enabledTabs[0]);
    }
  }

  public selectTab(tab: GameTab): void {
    const tabComponent = this.tabComponents.find(component => component.tab === tab);
    if (!tabComponent) {
      throw Error (`No tab component was registered for tab: ${tab.parentTab?.key}, ${tab.key}`);
    }
    this.tabComponents.toArray().forEach(component => component.isActive = false);
    tabComponent.isActive = true;
    this._selectedTab = tab;
    this.selectedTabChange.emit(tab);
    tab.onOpen.next();
  }
}
