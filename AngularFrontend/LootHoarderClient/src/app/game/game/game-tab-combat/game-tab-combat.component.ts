import { Component, Input, OnInit } from '@angular/core';
import { EnterAreaMessage } from '../../web-socket/enter-area-message';
import { WebSocketService } from '../../web-socket/web-socket.service';
import { Area } from '../client-representation/area';
import { Game } from '../client-representation/game';

@Component({
  selector: 'app-game-tab-combat',
  templateUrl: './game-tab-combat.component.html',
  styleUrls: ['./game-tab-combat.component.scss']
})
export class GameTabCombatComponent implements OnInit {
  @Input()
  public game!: Game;

  public selectedArea?: Area;

  public get areas(): Area[] {
    return this.game.areas;
  }

  public ngOnInit(): void {
    if (this.areas.length > 0) {
      this.selectArea(this.areas[0]);
    }
  }

  public selectArea(area: Area): void {
    this.selectedArea = area;
  }
}
