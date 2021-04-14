import WebSocket from 'ws';
import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
} from '@nestjs/websockets';
import { ConnectionsManager } from './services/connections-manager';
import { Connection } from './services/connection';
import { DbUserLoader } from './persistence/db-user-loader';
import { User } from './computed-game-state/user';
import { DbLoginRepository } from './persistence/db-login-repository';
import { GameService } from './services/game-service';
import { GamesManager } from './services/games-manager';

@WebSocketGateway()
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private logger: Logger = new Logger('AppGateway');

  public constructor(
    private readonly connectionsManager: ConnectionsManager,
    private readonly gameService: GameService,
    private readonly gamesManager: GamesManager,
    private readonly dbUserLoader: DbUserLoader,
    private readonly dbLoginRepository: DbLoginRepository
  ) {}

  public async handleDisconnect(client: WebSocket): Promise<void> {
    this.logger.log("Disconnected.");
  }

  public async handleConnection(client: WebSocket, ...args: any[]): Promise<void> {
    this.logger.log(`Client connected.`);

    const userAuthenticator = async (authToken: string) => {
      try {
        const userId = await this.dbLoginRepository.fetchUserIdFromAuthToken(authToken);
        const dbUser = await this.dbUserLoader.loadWithId(userId);
        if (!dbUser) {
          throw Error ('Could not load user.');
        }
        const user = new User(dbUser.id, dbUser.userName);
        return user;
      } 
      catch(error) {
        return undefined;
      }
    };

    const connection = new Connection(client, userAuthenticator);
    connection.initialize();

    this.connectionsManager.addConnection(connection);

    const subscription = connection.onMessage.subscribe(async (message) => {
      this.logger.log('Received message: ' + JSON.stringify(message))
      if (message.typeKey === 'load-game') {
        const gameId = message.data.gameId;
        const game = await this.gameService.loadGame(gameId);
        this.gamesManager.setConnection(game, connection);

        const uiGame = game.getUIState();
        connection.sendMessage({typeKey: 'full-game-state', data: { game: uiGame }});
        
        subscription.unsubscribe();
      }
    });

    connection.sendMessage({
      typeKey: 'welcome',
      data: 'Hello, you clever developer!'
    });
  }

  public async afterInit(server: WebSocket): Promise<void> {
    this.logger.log("After init");
  }
}
