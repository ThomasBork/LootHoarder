import { Injectable, Logger } from "@nestjs/common";
import { DbGame } from "src/raw-game-state/db-game";
import { DbGameState } from "src/raw-game-state/db-game-state";
import { DbQueryHelper } from "./db-query-helper";
import { GameForOverview } from "./game-for-overview";

@Injectable()
export class DbGameRepository {
  public constructor(private readonly dbQueryHelper: DbQueryHelper) {}
  
  public async insertGame(userId: number, gameState: DbGameState): Promise<number> {
    const con = await this.dbQueryHelper.createConnection();

    const query = `
      INSERT INTO game
        (user_id, created_at, state)
      VALUES
        (@userId, CURRENT_TIMESTAMP(), @state)
    `;

    const jsonState = JSON.stringify(gameState);

    const parameters = {
      userId,
      state: jsonState
    };

    const queryWithParameterValues = this.dbQueryHelper.buildQuery(query, parameters);

    const result = await con.query(queryWithParameterValues);

    con.end();

    const gameId = result['insertId'];

    return gameId;
  }

  public async fetchGamesForOverview(userId: number): Promise<GameForOverview[]> {
    const con = await this.dbQueryHelper.createConnection();

    const query = `
      SELECT id, created_at 
      FROM game 
      WHERE user_id = @userId
    `;

    const parameters = {
      userId
    };

    const queryWithParameterValues = this.dbQueryHelper.buildQuery(query, parameters);

    const result = await con.query(queryWithParameterValues);

    con.end();

    const games: GameForOverview[] = [];

    for(let i = 0; i<result.length; i++) {
      const resultRow = result[i];
      games.push({
        id: resultRow['id'],
        createdAt: resultRow['created_at']
      });
    }

    return games;
  }
  
  public async fetchGame(gameId: number): Promise<DbGame | undefined> {
    const con = await this.dbQueryHelper.createConnection();

    const query = `
      SELECT id, user_id, created_at, state
      FROM game
      WHERE id = @gameId
    `;

    const parameters = {
      gameId
    };

    const queryWithParameterValues = this.dbQueryHelper.buildQuery(query, parameters);

    const results = await con.query(queryWithParameterValues);

    con.end();

    if (results.length === 0) {
      return undefined;
    }

    const jsonState = JSON.parse(results[0]['state']);

    const game: DbGame = {
      id: results[0]['id'],
      userId: results[0]['user_id'],
      createdAt: results[0]['created_at'],
      state: jsonState,
    };

    return game;
  }
}
