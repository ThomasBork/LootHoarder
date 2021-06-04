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
import { ContractItemAddedToGameMessageContent } from 'src/loot-hoarder-contract/server-actions/contract-item-added-to-game-message-content';
import { ContractItemDroppedInAreaMessageContent } from 'src/loot-hoarder-contract/server-actions/contract-item-dropped-in-area-message-content';
import { ContractItemEquippedMessageContent } from 'src/loot-hoarder-contract/server-actions/contract-item-equipped-message-content';
import { ContractItemUnequippedMessageContent } from 'src/loot-hoarder-contract/server-actions/contract-item-unequipped-message-content';
import { ContractItemRemovedFromGameMessageContent } from 'src/loot-hoarder-contract/server-actions/contract-item-removed-from-game-message-content';
import { UIStateManager } from './ui-state-manager';
import { ContractHeroTookSkillNodeMessageContent } from 'src/loot-hoarder-contract/server-actions/contract-hero-took-skill-node-message-content';
import { ContractHeroUnspentSkillPointsChangedMessageContent } from 'src/loot-hoarder-contract/server-actions/contract-hero-unspent-skill-points-changed-message-content';
import { ContractChatMessageSentMessageContent } from 'src/loot-hoarder-contract/server-actions/contract-chat-message-sent-message-content';
import { ContractChatStatusMessageContent } from 'src/loot-hoarder-contract/server-actions/contract-chat-status-message-content';
import { ChatMessage } from './client-representation/chat-message';
import { User } from './client-representation/user';


@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit, OnDestroy {
  public isConnected: boolean = false;
  public isConnecting: boolean = true;
  public hasReceivedAFullGameState: boolean = false;
  private gameId?: number;

  public constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly webSocketService: WebSocketService,
    private readonly assetManagerService: AssetManagerService,
    private readonly gameStateMapper: GameStateMapper,
    private readonly uiStateMapper: UIStateMapper,
    private readonly combatMessageHandler: CombatMessageHandler,
    private readonly uiStateAdvancer: UIStateAdvancer,
    private readonly uiStateManager: UIStateManager
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
      this.uiStateManager.state = uiState;
      this.hasReceivedAFullGameState = true;

      this.uiStateAdvancer.beginUpdating(uiState);
      return;
    }

    if (!this.hasReceivedAFullGameState) {
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
      case ContractServerMessageType.chatStatus: {
        const data = message.data as ContractChatStatusMessageContent;
        const users = data.users.map(u => new User(u.id, u.userName));
        this.uiStateManager.state.updateConnectedUsers(users);
      }
      break;
      case ContractServerMessageType.chatMessageSent: {
        const data = message.data as ContractChatMessageSentMessageContent;
        const chatMessage = new ChatMessage(data.user.id, data.user.userName, data.messageContent, data.messageType, new Date());
        this.uiStateManager.state.addChatMessage(chatMessage);
      }
      break;
      case ContractServerMessageType.combat: {
        const combatId = message.data.combatId as number;
        const innerMessage = message.data.innerMessage as ContractCombatWebSocketInnerMessage;
        this.combatMessageHandler.handleMessage(this.uiStateManager.state.game, combatId, innerMessage);
      }
      break;
      case ContractServerMessageType.heroAdded: {
        const serverHero = message.data.hero as ContractHero;
        const hero = this.gameStateMapper.mapToHero(serverHero);
        this.uiStateManager.state.addHero(hero);
      }
      break;
      case ContractServerMessageType.areaAdded: {
        const serverArea = message.data.area as ContractArea;
        const area = this.gameStateMapper.mapToArea(serverArea, this.uiStateManager.state.game.heroes);
        this.uiStateManager.state.addArea(area);
      }
      break;
      case ContractServerMessageType.areaAbandoned: {
        const data = message.data as ContractAreaAbandonedMessageContent;
        this.uiStateManager.state.removeArea(data.areaId);
      }
      break;
      case ContractServerMessageType.combatStarted: {
        const data = message.data as ContractCombatStartedMessageContent;
        const area = this.uiStateManager.state.game.getArea(data.areaId);
        const combat = this.gameStateMapper.mapToCombat(data.combat);
        this.uiStateManager.state.startCombat(area, combat, data.combatNumber);
      }
      break;
      case ContractServerMessageType.areaTypeCompleted: {
        const data = message.data as ContractAreaTypeCompletedMessageContent;
        const completedAreaType = this.assetManagerService.getAreaType(data.areaTypeKey);
        const newAvailableAreaTypes = data.newAvailableAreaTypeKeys.map(key => this.assetManagerService.getAreaType(key));
        this.uiStateManager.state.addCompletedAreaType(completedAreaType);
        this.uiStateManager.state.addAvailableAreaTypes(newAvailableAreaTypes);
      }
      break;
      case ContractServerMessageType.heroTookSkillNode: {
        const data = message.data as ContractHeroTookSkillNodeMessageContent;
        const hero = this.uiStateManager.state.game.getHero(data.heroId);
        const node = hero.skillTree.getNode(data.nodeX, data.nodeY);
        node.isAvailable = false;
        node.isTaken = true;
        for(let newAvailableSkillNodeLocation of data.newAvailableSkillNodes) {
          const newAvailableSkillNode = hero.skillTree.getNode(newAvailableSkillNodeLocation.x, newAvailableSkillNodeLocation.y);
          newAvailableSkillNode.isAvailable = true;
        }
      }
      break;
      case ContractServerMessageType.heroUnspentSkillPointsChanged: {
        const data = message.data as ContractHeroUnspentSkillPointsChangedMessageContent;
        const hero = this.uiStateManager.state.game.getHero(data.heroId);
        hero.unspentSkillPoints = data.newUnspentSkillPoints;
      }
      break;
      case ContractServerMessageType.heroGainedExperience: {
        const data = message.data as ContractHeroGainedExperienceMessageContent;
        const hero = this.uiStateManager.state.game.getHero(data.heroId);
        hero.level = data.newLevel;
        hero.experience = data.newExperience;
      }
      break;
      case ContractServerMessageType.heroAttributeChanged: {
        const data = message.data as ContractHeroAttributeChangedMessageContent;
        const hero = this.uiStateManager.state.game.getHero(data.heroId);
        hero.attributes.setAttribute(
          data.attributeType, 
          data.tags,
          data.newAdditiveValue,
          data.newMultiplicativeValue,
          data.newValue
        );
      }
      break;
      case ContractServerMessageType.itemAddedToGame: {
        const data = message.data as ContractItemAddedToGameMessageContent;
        const item = this.gameStateMapper.mapToItem(data.item);
        this.uiStateManager.state.game.addItem(item);
      }
      break;
      case ContractServerMessageType.itemDroppedInArea: {
        const data = message.data as ContractItemDroppedInAreaMessageContent;
        const area = this.uiStateManager.state.game.getArea(data.areaId);
        const item = this.gameStateMapper.mapToItem(data.item);
        area.addItemToLoot(item);
      }
      break;
      case ContractServerMessageType.itemEquipped: {
        const data = message.data as ContractItemEquippedMessageContent;
        const item = this.gameStateMapper.mapToItem(data.item);
        const hero = this.uiStateManager.state.game.getHero(data.heroId);
        hero.equipItem(item, data.position);
      }
      break;
      case ContractServerMessageType.itemUnequipped: {
        const data = message.data as ContractItemUnequippedMessageContent;
        const hero = this.uiStateManager.state.game.getHero(data.heroId);
        hero.unequipItem(data.position);
      }
      break;
      case ContractServerMessageType.itemRemovedFromGame: {
        const data = message.data as ContractItemRemovedFromGameMessageContent;
        const item = this.uiStateManager.state.game.getItem(data.itemId);
        this.uiStateManager.state.game.removeItem(item);
      }
      break;
      default: {
        console.log(`Unhandled message: ${message.typeKey}`);
      }
    }
  }
}
