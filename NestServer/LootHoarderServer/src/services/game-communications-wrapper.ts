import { Logger } from "@nestjs/common";
import { Game } from "../computed-game-state/game";
import { Connection } from "./connection";
import { CommandBus } from "@nestjs/cqrs";
import { EnterAreaType } from "src/game-message-handlers/from-client/enter-area-type";
import { CreateHero } from "src/game-message-handlers/from-client/create-hero";
import { ContractServerWebSocketMessage } from "src/loot-hoarder-contract/contract-server-web-socket-message";
import { ContractClientWebSocketMessage } from "src/loot-hoarder-contract/contract-client-web-socket-message";
import { ContractClientMessageType } from "src/loot-hoarder-contract/contract-client-message-type";

export class GameCommunicationsWrapper {
  public game: Game;
  private logger: Logger = new Logger('GamesManager');
  private connection?: Connection;
  private commandBus: CommandBus;

  public constructor(
    game: Game,
    commandBus: CommandBus
  ) {
    this.game = game;
    this.commandBus = commandBus;

    this.setUpEventListeners();
  }

  public setConnection(connection: Connection): void {
    this.connection = connection;
    connection.onMessage.subscribe((message) => this.handleGameMessage(message));
  }

  private setUpEventListeners(): void {
    // TODO: Look into sending messages in bulk if this is too heavy.
    this.game.onEvent.subscribe(event => this.sendMessage(event));
  }

  private handleGameMessage(message: ContractClientWebSocketMessage): void {
    this.logger.log('Received message: ' + JSON.stringify(message));

    switch(message.typeKey) {
      case ContractClientMessageType.createHero: {
        const hero = this.expectProperty(message.data, 'hero');
        this.commandBus.execute(new CreateHero(
          this.game,
          this.expectProperty(hero, 'typeKey'),
          this.expectProperty(hero, 'name')
        ));
      }
      break;
      case ContractClientMessageType.enterArea:
        this.commandBus.execute(new EnterAreaType (
          this.game,
          this.expectProperty(message.data, 'typeKey'),
          this.expectProperty(message.data, 'heroIds')
        ));
        break;
      default:
        throw Error (`Unknown message type from client: '${message.typeKey}'`);
    }
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