import { Injectable, Logger } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Game } from 'src/computed-game-state/game';
import { Connection } from './connection';
import { GameCommunicationsWrapper } from './game-communications-wrapper';
import { Hero } from 'src/computed-game-state/hero';
import { ContractServerWebSocketMessage } from 'src/loot-hoarder-contract/server-actions/contract-server-web-socket-message';
import { Area } from 'src/computed-game-state/area/area';
import { ContractChatMessageSentMessage } from 'src/loot-hoarder-contract/server-actions/contract-chat-message-sent-message';
import { ContractServerChatMessageType } from 'src/loot-hoarder-contract/server-actions/contract-server-chat-message-type';

@Injectable()
export class GamesManager {
  private logger: Logger = new Logger('GamesManager');
  private gameCommunicationsWrappers: GameCommunicationsWrapper[] = [];

  private static _instance: GamesManager;

  public constructor(private readonly commandBus: CommandBus) {
    GamesManager._instance = this;
  }

  public static get instance(): GamesManager {
    if (!GamesManager._instance) {
      throw Error ('GamesManager has not been instantiated.');
    }

    return GamesManager._instance;
  }

  public addGame(game: Game, connection: Connection): GameCommunicationsWrapper {
    const wrapper = new GameCommunicationsWrapper(game, this.commandBus, connection);
    this.gameCommunicationsWrappers.push(wrapper);
    game.onHeroLevelUp.subscribe(hero => {
      const isOnlyHeroAtThisLevel = this.gameCommunicationsWrappers.every(otherWrapper =>
        otherWrapper.game.heroes.every(otherHero => 
          otherHero === hero 
          || otherHero.level < hero.level
        )
      );
      if (!isOnlyHeroAtThisLevel) {
        return;
      }
      const messageContent = `${hero.name} (owned by ${wrapper.user.userName}) was the first hero to reach level ${hero.level}!`;
      const message = new ContractChatMessageSentMessage(
        wrapper.user.id, 
        wrapper.user.userName, 
        messageContent, 
        ContractServerChatMessageType.userAccomplishmentAnnouncement
      );

      this.sendMessageToAll(message);
    });

    return wrapper;
  }

  public getWrapperFromGameId(gameId: number): GameCommunicationsWrapper | undefined {
    const wrapper = this.gameCommunicationsWrappers.find(w => w.game.id === gameId);
    if (!wrapper) {
      return undefined;
    }
    return wrapper;
  }

  public getGame(gameId: number): Game | undefined {
    const wrapper = this.gameCommunicationsWrappers.find(w => w.game.id === gameId);
    if (!wrapper) {
      return undefined;
    }
    return wrapper.game;
  }

  public getGameFromArea(area: Area): Game {
    const wrapper = this.gameCommunicationsWrappers.find(w => w.game.areas.includes(area));
    if (!wrapper) {
      throw Error (`Could not find game from area.`);
    }
    return wrapper.game;
  }

  public getGames(): Game[] {
    return this.gameCommunicationsWrappers.map(wrap => wrap.game);
  }
  
  public sendMessage(game: Game, message: ContractServerWebSocketMessage): void {
    const wrapper = this.gameCommunicationsWrappers.find(w => w.game === game);
    if (!wrapper) {
      return undefined;
    }

    wrapper.sendMessage(message);
  }

  public sendMessageToAll(message: ContractServerWebSocketMessage): void {
    for(const wrapper of this.gameCommunicationsWrappers) {
      wrapper.sendMessage(message);
    }
  }

  public getHero(gameId: number, heroId: number): Hero | undefined {
    const game = this.getGame(gameId);
    const hero = game!.findHero(heroId);
    return hero;
  }
}
