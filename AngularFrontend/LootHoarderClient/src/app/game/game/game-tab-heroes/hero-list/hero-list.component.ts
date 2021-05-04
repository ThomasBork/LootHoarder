import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Hero } from '../../client-representation/hero';

@Component({
  selector: 'app-hero-list',
  templateUrl: './hero-list.component.html',
  styleUrls: ['./hero-list.component.scss']
})
export class HeroListComponent {
  @Input()
  public heroes!: Hero[];

  @Output()
  public newHeroClick: EventEmitter<void> = new EventEmitter();
  @Output()
  public heroClick: EventEmitter<Hero> = new EventEmitter();

  public newHero(): void {
    this.newHeroClick.emit();
  }

  public onHeroClick(hero: Hero): void {
    this.heroClick.emit(hero);
  }
}
