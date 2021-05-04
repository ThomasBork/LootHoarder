import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ContractArea } from 'src/loot-hoarder-contract/contract-area';
import { ContractHero } from 'src/loot-hoarder-contract/contract-hero';
import { WebSocketService } from '../web-socket/web-socket.service';
import { CombatMessageHandler } from './combat-message-handler';
import { GameStateMapper } from './game-state-mapper';
import { AssetManagerService } from './client-representation/asset-manager.service';
import { ContractClientMessageType } from 'src/loot-hoarder-contract/client-actions/contract-client-message-type';
import { ContractServerWebSocketMessage } from 'src/loot-hoarder-contract/server-actions/contract-server-web-socket-message';
import { ContractServerMessageType } from 'src/loot-hoarder-contract/server-actions/contract-server-message-type';
import { ContractCombatWebSocketInnerMessage } from 'src/loot-hoarder-contract/server-actions/contract-combat-web-socket-inner-message';
import { UIState } from './client-representation/ui-state';
import { UIStateMapper } from './ui-state-mapper';
import { UIStateAdvancer } from './ui-state-advancer';
import { ContractServerWebSocketMultimessageContent } from 'src/loot-hoarder-contract/server-actions/contract-server-web-socket-multimessage-content';
import { ContractHeroGainedExperienceMessageContent } from 'src/loot-hoarder-contract/server-actions/contract-hero-gained-experience-message-content';
import { ContractHeroAttributeChangedMessageContent } from 'src/loot-hoarder-contract/server-actions/contract-hero-attribute-changed-message-content';
import { ContractAreaAbandonedMessageContent } from 'src/loot-hoarder-contract/server-actions/contract-area-abandoned-message-content';
import { ContractCombatStartedMessageContent } from 'src/loot-hoarder-contract/server-actions/contract-combat-started-message-content';
import { ContractAreaTypeCompletedMessageContent } from 'src/loot-hoarder-contract/server-actions/contract-area-type-completed-message-content';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit, OnDestroy {
  public isConnected: boolean = false;
  public isConnecting: boolean = true;
  public uiState?: UIState;
  private gameId?: number;

  public constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly webSocketService: WebSocketService,
    private readonly assetManagerService: AssetManagerService,
    private readonly gameStateMapper: GameStateMapper,
    private readonly uiStateMapper: UIStateMapper,
    private readonly combatMessageHandler: CombatMessageHandler,
    private readonly uiStateAdvancer: UIStateAdvancer
  ) { }

  public ngOnInit(): void {
    const gameIdString = this.activatedRoute.snapshot.paramMap.get('id');
    this.gameId = Number(gameIdString);

    this.assetManagerService.loadAssets();
    this.connect();
  }

  public ngOnDestroy(): void {
    this.webSocketService.disconnect();
    this.uiStateAdvancer.stopUpdating();
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
      const uiState = this.uiStateMapper.mapFromGame(message.data.game);
      this.uiState = uiState;

      this.uiStateAdvancer.beginUpdating(uiState);
      return;
    }

    if (!this.uiState) {
      throw Error (`Expected to receive a 'full-game-state' message before receiving a '${message.typeKey}' message.`);
    }

    switch (message.typeKey) {
      case ContractServerMessageType.multimessage: {
        const data = message.data as ContractServerWebSocketMultimessageContent;
        for(const innerMessage of data.messages) {
          this.handleMessage(innerMessage);
        }
      }
      break;
      case ContractServerMessageType.combat: {
        const combatId = message.data.combatId as number;
        const innerMessage = message.data.innerMessage as ContractCombatWebSocketInnerMessage;
        this.combatMessageHandler.handleMessage(this.uiState.game, combatId, innerMessage);
      }
      break;
      case ContractServerMessageType.heroAdded: {
        const serverHero = message.data.hero as ContractHero;
        const hero = this.gameStateMapper.mapToHero(serverHero);
        this.uiState.addHero(hero);
      }
      break;
      case ContractServerMessageType.areaAdded: {
        const serverArea = message.data.area as ContractArea;
        const area = this.gameStateMapper.mapToArea(serverArea);
        this.uiState.addArea(area);
      }
      break;
      case ContractServerMessageType.areaAbandoned: {
        const data = message.data as ContractAreaAbandonedMessageContent;
        this.uiState.removeArea(data.areaId);
      }
      break;
      case ContractServerMessageType.combatStarted: {
        const data = message.data as ContractCombatStartedMessageContent;
        const area = this.uiState.game.getArea(data.areaId);
        const combat = this.gameStateMapper.mapToCombat(data.combat);
        this.uiState.startCombat(area, combat, data.combatNumber);
      }
      break;
      case ContractServerMessageType.areaTypeCompleted: {
        const data = message.data as ContractAreaTypeCompletedMessageContent;
        const completedAreaType = this.assetManagerService.getAreaType(data.areaTypeKey);
        const newAvailableAreaTypes = data.newAvailableAreaTypeKeys.map(key => this.assetManagerService.getAreaType(key));
        this.uiState.addCompletedAreaType(completedAreaType);
        this.uiState.addAvailableAreaTypes(newAvailableAreaTypes);
      }
      break;
      case ContractServerMessageType.heroGainedExperience: {
        const data = message.data as ContractHeroGainedExperienceMessageContent;
        const hero = this.uiState.game.getHero(data.heroId);
        hero.level = data.newLevel;
        hero.experience = data.newExperience;
      }
      break;
      case ContractServerMessageType.heroAttributeChanged: {
        const data = message.data as ContractHeroAttributeChangedMessageContent;
        const hero = this.uiState.game.getHero(data.heroId);
        hero.attributes.setAttribute(data.attributeType, data.newValue);
      }
      break;
      default: {
        console.log(`Unhandled message: ${message.typeKey}`);
      }
    }
  }
}
