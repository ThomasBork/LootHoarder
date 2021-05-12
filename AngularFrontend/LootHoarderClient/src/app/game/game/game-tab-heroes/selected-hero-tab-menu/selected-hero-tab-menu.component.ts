import { Component, Input, OnInit } from '@angular/core';
import { Game } from '../../client-representation/game';
import { Hero } from '../../client-representation/hero';

@Component({
  selector: 'app-selected-hero-tab-menu',
  templateUrl: './selected-hero-tab-menu.component.html',
  styleUrls: ['./selected-hero-tab-menu.component.scss']
})
export class SelectedHeroTabMenuComponent implements OnInit {
  @Input()
  public hero!: Hero;

  public selectedTab: string = 'items';

  public ngOnInit(): void {
    this.selectedTab = 'items';
  }

  public changeTab(tabName: string): void {
    this.selectedTab = tabName;
  }
}
