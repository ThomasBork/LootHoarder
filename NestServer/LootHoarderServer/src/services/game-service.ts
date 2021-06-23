import { Injectable } from '@nestjs/common';
import { Game } from 'src/computed-game-state/game';
import { DbGameRepository } from 'src/persistence/db-game-repository';
import { DbGameState } from 'src/raw-game-state/db-game-state';
import { StaticGameContentService } from 'src/services/static-game-content-service';
import { Connection } from './connection';
import { GamesManager } from './games-manager';

@Injectable()
export class GameService {
  public constructor(
    private readonly gamesManager: GamesManager,
    private readonly dbGameRepository: DbGameRepository,
    private readonly staticGameContentService: StaticGameContentService
  ) {}

  public async createNewGame(userId: number): Promise<number> {
    const initialGameState: DbGameState = {
      heroes: [],
      settings: {
        automaticallyGoToNextCombat: false,
        alwaysShowChat: false
      },
      areas: [],
      items: [],
      completedAreaTypes: [],
      completedAchievementTypes: [],
      completedQuestTypes: [],
      achievementTypeStatuses: [],
      questTypeStatuses: [],
      nextAreaId: 1,
      nextCombatId: 1,
      nextHeroId: 1,
      nextCombatCharacterAbilityId: 1,
      nextItemId: 1,
      nextContinuousEffectId: 1
    };

    const gameId = await this.dbGameRepository.insertGame(userId, initialGameState);

    return gameId;
  }

  public async loadGame(gameId: number, connection: Connection): Promise<Game> {
    let wrapper = this.gamesManager.getWrapperFromGameId(gameId);
    if (!wrapper) {
      const dbGame = await this.dbGameRepository.fetchGame(gameId);
      if (!dbGame) {
        throw Error (`Unable to fetch game with id: '${gameId}'`);
      }
      const game = Game.load(dbGame);
      wrapper = this.gamesManager.addGame(game, connection);
    } else {
      wrapper.setConncetion(connection);
    }
    return wrapper.game;
  }
}
