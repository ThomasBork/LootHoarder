import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WebSocketMessage } from '../web-socket/web-socket-message';
import { WebSocketService } from '../web-socket/web-socket.service';
import { Game } from './client-representation/game';
import { CombatMessageHandler } from './combat-message-handler';
import { GameStateMapper } from './game-state-mapper';
import { ServerArea } from './server-representation/server-area';
import { ServerHero } from './server-representation/server-hero';
import { AssetManagerService } from './static-game-content/asset-manager.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit, OnDestroy {
  public isConnected: boolean = false;
  public isConnecting: boolean = true;
  public game?: Game;
  private gameId?: number;

  public constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly webSocketService: WebSocketService,
    private readonly assetManagerService: AssetManagerService,
    private readonly gameStateMapper: GameStateMapper,
    private readonly combatMessageHandler: CombatMessageHandler,
  ) { }

  public ngOnInit(): void {
    const gameIdString = this.activatedRoute.snapshot.paramMap.get('id');
    this.gameId = Number(gameIdString);

    this.assetManagerService.loadAssets();
    this.connect();
  }

  public ngOnDestroy(): void {
    this.webSocketService.disconnect();
  }

  private connect(): void {
    this.isConnected = false;
    this.isConnecting = true;

    this.webSocketService
      .connect()
      .then(() => {
        this.isConnected = true;
        this.webSocketService.onMessage.subscribe((message) => this.handleMessage(message));
        this.webSocketService.send({ typeKey: 'load-game', data: { gameId: this.gameId } });
      })
      .finally(() => this.isConnecting = false);
  }

  private handleMessage(message: WebSocketMessage): void {
    console.log("Game message received: ", message);
    if (message.typeKey === 'full-game-state'){
      this.game = this.gameStateMapper.mapToGame(message.data.game);
      return;
    }

    if (!this.game) {
      throw Error (`Expected to receive a 'full-game-state' message before receiving a '${message.typeKey}' message.`);
    }
    
    switch (message.typeKey) {
      case 'full-game-state': 
      break;
      case 'hero-added': {
        const serverHero = message.data.hero as ServerHero;
        const hero = this.gameStateMapper.mapToHero(serverHero);
        this.game.heroes.push(hero);
      }
      break;
      case 'area-created': {
        const serverArea = message.data.area as ServerArea;
        const area = this.gameStateMapper.mapToArea(serverArea);
        this.game.areas.push(area);
      }
      break;
      case 'combat': {
        const combatId = message.data.combatId as number;
        const innerMessage = message.data.innerMessage as WebSocketMessage;
        this.combatMessageHandler.handleMessage(this.game, combatId, innerMessage);
      }
      break;
    }
  }
}
