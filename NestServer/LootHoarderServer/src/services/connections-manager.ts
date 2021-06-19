import { Injectable } from '@nestjs/common';
import { User } from 'src/computed-game-state/user';
import { ContractServerWebSocketMessage } from 'src/loot-hoarder-contract/server-actions/contract-server-web-socket-message';
import { Connection } from './connection';
import WebSocket from 'ws';

@Injectable()
export class ConnectionsManager {
  private connections: Connection[] = [];

  public findConnectionForPlayer(userId: number): Connection | undefined {
    return this.connections.find(c => c.user?.id === userId);
  }

  public addConnection(connection: Connection): void {
    if (connection.user) {
      const existingConnection = this.findConnectionForPlayer(connection.user.id);
      if (existingConnection) {
        this.connections.splice(this.connections.indexOf(existingConnection, 1));
      }
    }
    this.connections.push(connection);
  }

  public sendMessageToAll(message: ContractServerWebSocketMessage): void {
    this.connections.forEach(connection => connection.sendMessage(message));
  }

  public getConnectedUsers(): User[] {
    return this.connections
      .filter(c => c.user)
      .map(c => c.user!);
  }

  public removeConnection(webSocketClient: WebSocket): void {
    this.connections = this.connections.filter(c => c.socket !== webSocketClient);
  }

  public getConnectionFromWebSocketClient(webSocketClient: WebSocket): Connection | undefined {
    return this.connections.find(c => c.socket === webSocketClient);
  }
}
