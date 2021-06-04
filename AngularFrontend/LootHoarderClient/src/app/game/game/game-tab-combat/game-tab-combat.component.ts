import { Component, Input, OnInit } from '@angular/core';
import { WebSocketService } from '../../web-socket/web-socket.service';
import { Area } from '../client-representation/area';
import { Game } from '../client-representation/game';
import { ContractLeaveAreaMessage } from 'src/loot-hoarder-contract/client-actions/contract-leave-area-message'
import { ContractGoToNextCombatMessage } from 'src/loot-hoarder-contract/client-actions/contract-go-to-next-combat-message'
import { UIStateManager } from '../ui-state-manager';

@Component({
  selector: 'app-game-tab-combat',
  templateUrl: './game-tab-combat.component.html',
  styleUrls: ['./game-tab-combat.component.scss']
})
export class GameTabCombatComponent implements OnInit {

  public constructor(
    private readonly webSocketService: WebSocketService,
    private readonly uiStateManager: UIStateManager
  ) 
  {}

  public get areas(): Area[] {
    return this.uiStateManager.state.game.areas;
  }

  public get selectedArea(): Area | undefined {
    return this.uiStateManager.state.combatTab.selectedArea;
  }

  public get hasCombatEnded(): boolean {
    return !!this.selectedArea
      && this.selectedArea.currentCombat.hasEnded;
  }

  public get canGoToNextCombat(): boolean {
    return !!this.selectedArea
      && this.selectedArea.canGoToNextCombat;
  }

  public ngOnInit(): void {
    if (this.areas.length > 0) {
      this.selectArea(this.areas[0]);
    }
  }

  public selectArea(area: Area): void {
    this.uiStateManager.state.combatTab.selectedArea = area;
  }

  public goToNextCombat(area: Area): void {
    this.webSocketService.send(new ContractGoToNextCombatMessage(area.id));
  }

  public leaveArea(area: Area): void {
    this.webSocketService.send(new ContractLeaveAreaMessage(area.id));
  }
}
