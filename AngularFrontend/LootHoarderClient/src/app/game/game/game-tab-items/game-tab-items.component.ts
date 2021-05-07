import { Component, Input } from '@angular/core';
import { WebSocketService } from '../../web-socket/web-socket.service';
import { Game } from '../client-representation/game';

@Component({
  selector: 'app-game-tab-items',
  templateUrl: './game-tab-items.component.html',
  styleUrls: ['./game-tab-items.component.scss']
})
export class GameTabItemsComponent {
  @Input()
  public game!: Game;

  public constructor (
    private readonly webSocketService: WebSocketService
  ) {

  }
}
