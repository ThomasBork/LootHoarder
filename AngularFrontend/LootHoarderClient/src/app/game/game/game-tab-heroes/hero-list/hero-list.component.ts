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

  public newHero(): void {
    this.newHeroClick.emit();
  }
}
