import { Injectable } from '@nestjs/common';
import { Game } from 'src/computed-game-state/game';
import { DbGameRepository } from 'src/persistence/db-game-repository';
import { DbGameState } from 'src/raw-game-state/db-game-state';
import { StaticGameContentService } from 'src/services/static-game-content-service';
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
      areas: [],
      completedAreaTypes: [],
      nextAreaId: 1,
      nextCombatId: 1,
      nextHeroId: 1,
      nextAbilityId: 1
    };

    const gameId = await this.dbGameRepository.insertGame(userId, initialGameState);

    return gameId;
  }

  public async loadGame(gameId: number): Promise<Game> {
    let game = this.gamesManager.getGame(gameId);
    if (!game) {
      const dbGame = await this.dbGameRepository.fetchGame(gameId);
      if (!dbGame) {
        throw Error (`Unable to fetch game with id: '${gameId}'`);
      }
      game = Game.load(dbGame, this.staticGameContentService);
      this.gamesManager.addGame(game);
    }
    return game;
  }
}
