import { Component, Input, OnInit } from '@angular/core';
import { Combat } from '../../client-representation/combat';

@Component({
  selector: 'app-combat',
  templateUrl: './combat.component.html',
  styleUrls: ['./combat.component.scss']
})
export class CombatComponent {
  @Input()
  public combat!: Combat;
}
