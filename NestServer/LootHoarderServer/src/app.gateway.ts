import WebSocket from 'ws';
import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
} from '@nestjs/websockets';
import { ConnectionsManager } from './services/connections-manager';
import { Connection } from './services/connection';
import { DbUserLoader } from './persistence/db-user-loader';
import { User } from './computed-game-state/user';
import { DbLoginRepository } from './persistence/db-login-repository';
import { GameService } from './services/game-service';
import { GamesManager } from './services/games-manager';
import { ContractClientMessageType } from './loot-hoarder-contract/client-actions/contract-client-message-type';
import { ContractServerMessageType } from './loot-hoarder-contract/server-actions/contract-server-message-type';
import { ContractChatMessageSentMessage } from './loot-hoarder-contract/server-actions/contract-chat-message-sent-message';
import { ContractChatStatusMessage } from './loot-hoarder-contract/server-actions/contract-chat-status-message';
import { RandomService } from './services/random-service';
import { ContractServerChatMessageType } from './loot-hoarder-contract/server-actions/contract-server-chat-message-type';
import { ChatStatusUser } from './loot-hoarder-contract/server-actions/contract-chat-status-user';

@WebSocketGateway()
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private logger: Logger = new Logger('AppGateway');

  public constructor(
    private readonly connectionsManager: ConnectionsManager,
    private readonly gameService: GameService,
    private readonly gamesManager: GamesManager,
    private readonly dbUserLoader: DbUserLoader,
    private readonly dbLoginRepository: DbLoginRepository,
    private readonly randomService: RandomService,
  ) {}

  public async handleDisconnect(client: WebSocket): Promise<void> {
    this.logger.log("Client disconnected.");
    this.connectionsManager.removeConnection(client);
  }

  public async handleConnection(client: WebSocket, ...args: any[]): Promise<void> {
    this.logger.log(`Client connected.`);

    const connection = new Connection(client);
    connection.onAuthTokenReceived.subscribe(async (authToken) => {
      let user: User;
      try {
        const userId = await this.dbLoginRepository.fetchUserIdFromAuthToken(authToken);
        const dbUser = await this.dbUserLoader.loadWithId(userId);
        if (!dbUser) {
          throw Error ('Could not load user.');
        }
        user = new User(dbUser.id, dbUser.userName);
      }
      catch(error) {
        return;
      }

      if (user === null) {
        connection.sendMessage({ 
          typeKey: ContractServerMessageType.authenticationResponse, 
          data: { success: false, error: `Could not authenticate with the token: "${authToken}"` }
        });
        connection.socket.close();
      } else {
        connection.user = user;
        connection.sendMessage({ 
          typeKey: ContractServerMessageType.authenticationResponse, 
          data: { success: true }
        });
      }
    });
    connection.initialize();

    this.connectionsManager.addConnection(connection);

    const connectionSubscription = connection.onMessage.subscribe(async (message) => {
      this.logger.log(`Message received: ${message}`);

      if (message.typeKey === ContractClientMessageType.loadGame) {
        if (!connection.user) {
          throw Error('Must be authenticatd to load a game.');
        }

        const gameId = message.data.gameId;
        const game = await this.gameService.loadGame(gameId);
        this.gamesManager.setConnection(game, connection);

        const uiGame = game.toContractModel();
        connection.sendMessage({typeKey: ContractServerMessageType.fullGameState, data: { game: uiGame }});

        const connectedUsers = this.connectionsManager
          .getConnectedUsers()
          .map(u => {
            const chatStatusUser: ChatStatusUser = {
              id: u.id,
              userName: u.userName
            };
            return chatStatusUser;
          });
        const chatStatusMessage = new ContractChatStatusMessage(connectedUsers);
        connection.sendMessage(chatStatusMessage);

        const adverbs = ['beautiful', 'amazing', 'clever', 'glorious', 'fantastic', 'wonderful'];
        const adverb = this.randomService.randomElementInArray(adverbs);
        const welcomeMessageContent = `The ${adverb} ${connection.user.userName} has joined the chat.`;
        const welcomeMessage = new ContractChatMessageSentMessage(connection.user.id, connection.user.userName, welcomeMessageContent, ContractServerChatMessageType.userConnected);
        this.connectionsManager.sendMessageToAll(welcomeMessage);

        connectionSubscription.unsubscribe();
      }
    });
  }
}
