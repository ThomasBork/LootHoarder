import { Body, Controller, Get, Headers, Post } from '@nestjs/common';
import { DbGameRepository } from 'src/persistence/db-game-repository';
import { GameForOverview } from 'src/persistence/game-for-overview';
import { GameService } from 'src/services/game-service';
import { AuthService } from '../../services/auth-service';
import { CreateGameInput } from './create-game-input';

@Controller('game')
export class GameController {
  constructor(
    private readonly authService: AuthService,
    private readonly dbGameRepository: DbGameRepository,
    private readonly gameService: GameService
  ) {}

  @Get('games')
  public async getGames(@Headers('authentication') authToken: string): Promise<{ games: GameForOverview[] }> {
    const userId = await this.authService.fetchUserIdFromAuthToken(authToken);
    const games = await this.dbGameRepository.fetchGamesForOverview(userId);
    return { games };
  }

  @Post('createGame')
  public async createGame(@Headers('authentication') authToken: string, @Body() body: CreateGameInput): Promise<{ gameId: number }> {
    const userId = await this.authService.fetchUserIdFromAuthToken(authToken);
    const gameId = await this.gameService.createNewGame(userId);
    return { gameId };
  }
}
