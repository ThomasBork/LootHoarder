import { Injectable } from '@nestjs/common';
import { Connection } from './connection';

@Injectable()
export class ConnectionsManager {
  private connections: Connection[] = [];

  public findConnectionForPlayer(userId: number): Connection | undefined {
    return this.connections.find(c => c.user?.id === userId);
  }

  public addConnection(connection: Connection): void {
    // TODO: Figure out how to handle existing connections.
    this.connections = [];
    this.connections.push(connection);
  }
}
