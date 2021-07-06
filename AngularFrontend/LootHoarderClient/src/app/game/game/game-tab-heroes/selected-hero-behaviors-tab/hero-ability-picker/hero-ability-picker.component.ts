import { Component, EventEmitter, Input, Output } from '@angular/core';
import { HeroAbility } from 'src/app/game/game/client-representation/hero-ability';

@Component({
  selector: 'app-hero-ability-picker',
  templateUrl: './hero-ability-picker.component.html',
  styleUrls: ['./hero-ability-picker.component.scss']
})
export class HeroAbilityPickerComponent {
  @Input()
  public abilities!: HeroAbility[];

  @Input()
  public selectedAbility!: HeroAbility;

  @Output()
  public selectedAbilityChange: EventEmitter<HeroAbility>;

  public constructor() {
    this.selectedAbilityChange = new EventEmitter();
  }

  public selectAbility(ability: HeroAbility): void {
    this.selectedAbility = ability;
    this.selectedAbilityChange.emit(ability);
  }
}
