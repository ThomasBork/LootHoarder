import { Logger } from '@nestjs/common';
import { Subject } from 'rxjs';
import { User } from 'src/computed-game-state/user';
import { ContractClientWebSocketMessage } from 'src/loot-hoarder-contract/client-actions/contract-client-web-socket-message';
import { ContractServerMessageType } from 'src/loot-hoarder-contract/server-actions/contract-server-message-type';
import { ContractServerWebSocketMessage } from 'src/loot-hoarder-contract/server-actions/contract-server-web-socket-message';
import WebSocket from 'ws';

export class Connection {
  public user?: User;
  public socket: WebSocket;
  public onMessage: Subject<ContractClientWebSocketMessage>;
  
  private logger: Logger = new Logger('Connection');
  
  private userAuthenticator: (authToken: string) => Promise<User | undefined>;

  public constructor(socket: WebSocket, userAuthenticator: (authToken: string) => Promise<User | undefined>) {
    this.socket = socket;
    this.userAuthenticator = userAuthenticator;
    this.user = undefined;
    this.onMessage = new Subject();
  }

  public get isAuthenticated(): boolean { 
    return this.user !== undefined;
  }

  public initialize(): void {
    this.socket.onmessage = async (event) => {
      const message = event.data.toString();

      if (!this.isAuthenticated) {
        const authToken = message;
        const player = await this.userAuthenticator(authToken);
        if (player === null) {
          this.sendMessage({ 
            typeKey: ContractServerMessageType.authenticationResponse, 
            data: { success: false, error: `Could not authenticate with the token: "${authToken}"` }
          });
          this.socket.close();
        } else {
          this.user = player;
          this.sendMessage({ 
            typeKey: ContractServerMessageType.authenticationResponse, 
            data: { success: true }
          });
        }
      } else {
        let messageObject = null;
        try {
          messageObject = JSON.parse(message);
        } catch (_) {
          throw new Error('Could not parse this message: "' + message + '"');
        }
        this.onMessage.next(messageObject);
      }
    };
  }

  public sendMessage(message: ContractServerWebSocketMessage): void {
    this.socket.send(JSON.stringify(message));
  }
}
