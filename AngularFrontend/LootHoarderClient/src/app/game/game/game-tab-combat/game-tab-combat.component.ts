import { Component, Input, OnInit } from '@angular/core';
import { WebSocketService } from '../../web-socket/web-socket.service';
import { Area } from '../client-representation/area';
import { Game } from '../client-representation/game';
import { ContractLeaveAreaMessage } from 'src/loot-hoarder-contract/client-actions/contract-leave-area-message'
import { ContractGoToNextCombatMessage } from 'src/loot-hoarder-contract/client-actions/contract-go-to-next-combat-message'

@Component({
  selector: 'app-game-tab-combat',
  templateUrl: './game-tab-combat.component.html',
  styleUrls: ['./game-tab-combat.component.scss']
})
export class GameTabCombatComponent implements OnInit {
  @Input()
  public game!: Game;

  public selectedArea?: Area;

  public constructor(
    private readonly webSocketService: WebSocketService
  ) 
  {}

  public get areas(): Area[] {
    return this.game.areas;
  }

  public get hasCombatEnded(): boolean {
    return !!this.selectedArea
      && this.selectedArea.currentCombat.hasEnded;
  }

  public get canGoToNextCombat(): boolean {
    return !!this.selectedArea
      && this.selectedArea.currentCombat.hasEnded
      && !!this.selectedArea.currentCombat.didTeam1Win
      && this.selectedArea.currentCombatNumber < this.selectedArea.totalAmountOfCombats;
  }

  public ngOnInit(): void {
    if (this.areas.length > 0) {
      this.selectArea(this.areas[0]);
    }
  }

  public selectArea(area: Area): void {
    this.selectedArea = area;
  }

  public goToNextCombat(area: Area): void {
    this.webSocketService.send(new ContractGoToNextCombatMessage(area.id));
  }

  public leaveArea(area: Area): void {
    this.webSocketService.send(new ContractLeaveAreaMessage(area.id));
  }
}
