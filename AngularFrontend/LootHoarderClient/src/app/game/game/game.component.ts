import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ContractArea } from 'src/loot-hoarder-contract/contract-area';
import { ContractHero } from 'src/loot-hoarder-contract/contract-hero';
import { WebSocketService } from '../web-socket/web-socket.service';
import { Game } from './client-representation/game';
import { CombatMessageHandler } from './combat-message-handler';
import { GameStateMapper } from './game-state-mapper';
import { AssetManagerService } from './client-representation/asset-manager.service';
import { ContractClientMessageType } from 'src/loot-hoarder-contract/contract-client-message-type';
import { ContractServerWebSocketMessage } from 'src/loot-hoarder-contract/contract-server-web-socket-message';
import { ContractServerMessageType } from 'src/loot-hoarder-contract/contract-server-message-type';
import { ContractCombatWebSocketInnerMessage } from 'src/loot-hoarder-contract/contract-combat-web-socket-inner-message';

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
        this.webSocketService.send({ typeKey: ContractClientMessageType.loadGame, data: { gameId: this.gameId } });
      })
      .finally(() => this.isConnecting = false);
  }

  private handleMessage(message: ContractServerWebSocketMessage): void {
    console.log("Game message received: ", message);
    if (message.typeKey === ContractServerMessageType.fullGameState){
      this.game = this.gameStateMapper.mapToGame(message.data.game);
      return;
    }

    if (!this.game) {
      throw Error (`Expected to receive a 'full-game-state' message before receiving a '${message.typeKey}' message.`);
    }

    switch (message.typeKey) {
      case ContractServerMessageType.heroAdded: {
        const serverHero = message.data.hero as ContractHero;
        const hero = this.gameStateMapper.mapToHero(serverHero);
        this.game.heroes.push(hero);
      }
      break;
      case ContractServerMessageType.areaAdded: {
        const serverArea = message.data.area as ContractArea;
        const area = this.gameStateMapper.mapToArea(serverArea);
        this.game.areas.push(area);
      }
      break;
      case ContractServerMessageType.combat: {
        const combatId = message.data.combatId as number;
        const innerMessage = message.data.innerMessage as ContractCombatWebSocketInnerMessage;
        this.combatMessageHandler.handleMessage(this.game, combatId, innerMessage);
      }
      break;
      default: {
        console.log(`Unhandled message: ${message.typeKey}`);
      }
    }
  }
}
