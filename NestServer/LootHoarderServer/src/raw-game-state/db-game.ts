import { DbGameState } from './db-game-state';

export interface DbGame {
  id: number;
  userId: number;
  createdAt: Date;
  state: DbGameState;
}
