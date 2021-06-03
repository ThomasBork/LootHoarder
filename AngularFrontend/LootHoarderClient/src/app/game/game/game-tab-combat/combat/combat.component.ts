import { Component, Input, OnInit } from '@angular/core';
import { Area } from '../../client-representation/area';
import { Combat } from '../../client-representation/combat';

@Component({
  selector: 'app-combat',
  templateUrl: './combat.component.html',
  styleUrls: ['./combat.component.scss']
})
export class CombatComponent {
  @Input()
  public combat!: Combat;
  @Input()
  public area!: Area;
}
