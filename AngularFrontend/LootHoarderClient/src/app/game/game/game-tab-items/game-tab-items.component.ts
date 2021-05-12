import { Component, Input } from '@angular/core';
import { WebSocketService } from '../../web-socket/web-socket.service';
import { Game } from '../client-representation/game';
import { UIStateManager } from '../ui-state-manager';

@Component({
  selector: 'app-game-tab-items',
  templateUrl: './game-tab-items.component.html',
  styleUrls: ['./game-tab-items.component.scss']
})
export class GameTabItemsComponent {
  public constructor (
    private readonly webSocketService: WebSocketService,
    private readonly uiStateManager: UIStateManager
  ) {

  }

  public get items() { return this.uiStateManager.state.game.items; }
}
