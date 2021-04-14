import { Injectable, Logger } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Game } from 'src/computed-game-state/game';
import { Connection } from './connection';
import { GameCommunicationsWrapper } from './game-communications-wrapper';
import { WebSocketMessage } from '../web-socket-messages/web-socket-message';
import { Hero } from 'src/computed-game-state/hero';

@Injectable()
export class GamesManager {
  private logger: Logger = new Logger('GamesManager');
  private gameCommunicationsWrappers: GameCommunicationsWrapper[] = [];

  private static instance: GamesManager;

  public constructor(private readonly commandBus: CommandBus) {
    GamesManager.instance = this;
  }

  public addGame(game: Game): void {
    const wrapper = new GameCommunicationsWrapper(game, this.commandBus);
    this.gameCommunicationsWrappers.push(wrapper);
  }

  public getGame(gameId: number): Game | undefined {
    const wrapper = this.gameCommunicationsWrappers.find(w => w.game.id === gameId);
    if (!wrapper) {
      return undefined;
    }
    return wrapper.game;
  }

  public getGames(): Game[] {
    return this.gameCommunicationsWrappers.map(wrap => wrap.game);
  }
  
  public setConnection(game: Game, connection: Connection): void {
    const wrapper = this.gameCommunicationsWrappers.find(w => w.game === game);
    if (!wrapper) {
      throw Error('Cannot set connection to a game that is not loaded');
    }
    wrapper.setConnection(connection);
  }
  
  public sendMessage(game: Game, message: WebSocketMessage): void {
    const wrapper = this.gameCommunicationsWrappers.find(w => w.game === game);
    if (!wrapper) {
      return undefined;
    }

    wrapper.sendMessage(message);
  }

  public getHero(gameId: number, heroId: number): Hero | undefined {
    const game = this.getGame(gameId);
    const hero = game!.findHero(heroId);
    return hero;
  }

  public static getInstance(): GamesManager {
    if (!GamesManager.instance) {
      throw Error ('GamesManager has not been instantiated.');
    }

    return GamesManager.instance;
  }
}
