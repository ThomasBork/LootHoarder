import { Logger } from "@nestjs/common";
import { Game } from "../computed-game-state/game";
import { Connection } from "./connection";
import { CommandBus } from "@nestjs/cqrs";
import { EnterAreaType } from "src/game-message-handlers/from-client/enter-area-type";
import { CreateHero } from "src/game-message-handlers/from-client/create-hero";
import { ContractSendChatMessageMessageContent } from "src/loot-hoarder-contract/client-actions/contract-send-chat-message-message-content";
import { ContractLeaveAreaMessageContent } from "src/loot-hoarder-contract/client-actions/contract-leave-area-message-content";
import { ContractEquipItemMessageContent } from "src/loot-hoarder-contract/client-actions/contract-equip-item-message-content";
import { ContractGoToNextCombatMessageContent } from "src/loot-hoarder-contract/client-actions/contract-go-to-next-combat-message-content";
import { ContractSetSettingMessageContent } from "src/loot-hoarder-contract/client-actions/contract-set-setting-message-content";
import { ContractServerWebSocketMessage } from "src/loot-hoarder-contract/server-actions/contract-server-web-socket-message";
import { ContractClientWebSocketMessage } from "src/loot-hoarder-contract/client-actions/contract-client-web-socket-message";
import { ContractClientMessageType } from "src/loot-hoarder-contract/client-actions/contract-client-message-type";
import { LeaveArea } from "src/game-message-handlers/from-client/leave-area";
import { GoToNextCombat } from "src/game-message-handlers/from-client/go-to-next-combat";
import { SetSetting } from "src/game-message-handlers/from-client/set-setting";
import { EquipItem } from "src/game-message-handlers/from-client/equip-item";
import { ContractCreateHeroMessageContent } from "src/loot-hoarder-contract/client-actions/contract-create-hero-message-content";
import { ContractDeleteHeroMessageContent } from "src/loot-hoarder-contract/client-actions/contract-delete-hero-message-content";
import { ContractTakeHeroSkillNodeMessageContent } from "src/loot-hoarder-contract/client-actions/contract-take-hero-skill-node-message-content";
import { TakeHeroSkillNode } from "src/game-message-handlers/from-client/take-hero-skill-node";
import { SendChatMessage } from "src/game-message-handlers/from-client/send-chat-message";
import { DeleteHero } from "src/game-message-handlers/from-client/delete-hero";
import { User } from "src/computed-game-state/user";
import { ContractCreateHeroBehaviorMessageContent } from "src/loot-hoarder-contract/client-actions/contract-create-hero-behavior-message-content";
import { CreateHeroBehavior } from "src/game-message-handlers/from-client/create-hero-behavior";
import { ContractUpdateHeroBehaviorMessageContent } from "src/loot-hoarder-contract/client-actions/contract-update-hero-behavior-message-content";
import { UpdateHeroBehavior } from "src/game-message-handlers/from-client/update-hero-behavior";
import { ContractSetCurrentHeroBehaviorMessageContent } from "src/loot-hoarder-contract/client-actions/contract-set-current-hero-behavior-message-content";
import { SetCurrentHeroBehavior } from "src/game-message-handlers/from-client/set-current-hero-behavior";
import { DbGameRepository } from "src/persistence/db-game-repository";

export class GameCommunicationsWrapper {
  public game: Game;
  private logger: Logger = new Logger('GameCommunicationsWrapper');
  private connection: Connection;
  private commandBus: CommandBus;
  private dbGameRepository: DbGameRepository;

  public constructor(
    game: Game,
    commandBus: CommandBus,
    connection: Connection,
    dbGameRepository: DbGameRepository
  ) {
    this.game = game;
    this.commandBus = commandBus;
    this.connection = connection;
    this.dbGameRepository = dbGameRepository;
    
    this.setUpConnectionEventListeners(connection);
    this.setUpGameEventListeners(game);
  }

  public get user(): User {
    const user = this.connection.user;
    if (!user) {
      throw Error (`The connection is expected to have a user when it has loaded a game.`);
    }
    return user;
  }

  public setConncetion(connection: Connection): void {
    if (this.connection) {
      this.removeConnectionEventListeners(this.connection);
    }
    this.connection = connection;
    this.setUpConnectionEventListeners(connection);
  }

  private setUpConnectionEventListeners(connection: Connection): void {
    connection.onMessage.subscribe((message) => this.handleGameMessage(message));
  }

  private removeConnectionEventListeners(connection: Connection): void {
    connection.onMessage.unsubscribe();
  }

  private setUpGameEventListeners(game: Game): void {
    game.onEvent.subscribe(event => this.sendMessage(event));
  }

  private handleGameMessage(message: ContractClientWebSocketMessage): void {
    this.logger.log('Received message: ' + JSON.stringify(message));

    switch(message.typeKey) {
      case ContractClientMessageType.sendChatMessage: {
        const data: ContractSendChatMessageMessageContent = message.data;
        const user = this.connection!.user!;
        this.commandBus.execute(new SendChatMessage(
          user.id,
          user.userName,
          data.messageContent
        ));
      }
      break;
      case ContractClientMessageType.createHero: {
        const data: ContractCreateHeroMessageContent = message.data;
        this.commandBus.execute(new CreateHero(
          this.game,
          data.hero.typeKey,
          data.hero.name,
          data.hero.eyesId,
          data.hero.noseId,
          data.hero.mouthId
        ));
      }
      break;
      case ContractClientMessageType.deleteHero: {
        const data: ContractDeleteHeroMessageContent = message.data;
        this.commandBus.execute(new DeleteHero(this.game, data.heroId));
      }
      break;
      case ContractClientMessageType.enterArea: {
        this.commandBus.execute(new EnterAreaType (
          this.game,
          this.expectProperty(message.data, 'typeKey'),
          this.expectProperty(message.data, 'heroIds')
        ));
      }
      break;
      case ContractClientMessageType.leaveArea: {
        const data: ContractLeaveAreaMessageContent = message.data;
        const area = this.game.getArea(data.areaId);
        this.commandBus.execute(new LeaveArea (
          this.game,
          area,
        ));
      }
      break;
      case ContractClientMessageType.equipItem: {
        const data: ContractEquipItemMessageContent = message.data;
        this.commandBus.execute(new EquipItem (
          this.game,
          data.heroId,
          data.itemId,
          data.inventoryPosition
        ));
      }
      break;
      case ContractClientMessageType.takeHeroSkillNode: {
        const data: ContractTakeHeroSkillNodeMessageContent = message.data;
        this.commandBus.execute(new TakeHeroSkillNode (
          this.game,
          data.heroId,
          data.nodeX,
          data.nodeY
        ));
      }
      break;
      case ContractClientMessageType.goToNextCombat: {
        const data: ContractGoToNextCombatMessageContent = message.data;
        const area = this.game.getArea(data.areaId);
        this.commandBus.execute(new GoToNextCombat (
          this.game,
          area,
        ));
      }
      break;
      case ContractClientMessageType.createHeroBehavior: {
        const data: ContractCreateHeroBehaviorMessageContent = message.data;
        this.commandBus.execute(new CreateHeroBehavior (
          this.game,
          data.heroId,
        ));
      }
      break;
      case ContractClientMessageType.updateHeroBehavior: {
        const data: ContractUpdateHeroBehaviorMessageContent = message.data;
        this.commandBus.execute(new UpdateHeroBehavior (
          this.game,
          data.heroId,
          data.behavior
        ));
      }
      break;
      case ContractClientMessageType.setCurrentHeroBehavior: {
        const data: ContractSetCurrentHeroBehaviorMessageContent = message.data;
        this.commandBus.execute(new SetCurrentHeroBehavior (
          this.game,
          data.heroId,
          data.behaviorId
        ));
      }
      break;
      case ContractClientMessageType.setSetting: {
        const data: ContractSetSettingMessageContent = message.data;
        this.commandBus.execute(new SetSetting (
          this.game,
          data.settingType,
          data.value
        ));
      }
      break;
      default:
        throw Error (`Unknown message type from client: '${message.typeKey}'`);
    }

    this.dbGameRepository.updateGameState(this.game.id, this.game.dbModel.state);
  }

  private expectProperty(dataObject: any, propertyKey: string): any {
    const hasProperty = dataObject.hasOwnProperty(propertyKey);
    if (!hasProperty) {
      throw Error (`Expected object to have property with name "${propertyKey}".`);
    }
    return dataObject[propertyKey];
  }

  public sendMessage(message: ContractServerWebSocketMessage): void {
    if (!this.connection) {
      return;
    }

    this.connection.sendMessage(message);
  }
}
