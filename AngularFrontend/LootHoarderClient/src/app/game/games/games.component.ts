import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GameForOverview } from '../service/game-for-overview';
import { GameService } from '../service/game.service';

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.scss']
})
export class GamesComponent implements OnInit {
  public games: GameForOverview[] = [];
  public isLoading: boolean = true;

  public constructor(
    private readonly gameService: GameService,
    private readonly router: Router
  ) { }

  public ngOnInit(): void {
    this.loadGames();
  }

  public async createGame(): Promise<void> {
    const gameId = await this.gameService.createGame();
    console.log("Created game with id", gameId);
    this.loadGames();
  }

  public goToGame(gameId: number): void {
    this.router.navigate(['/game/', gameId]);
  }

  private async loadGames(): Promise<void> {
    this.isLoading = true;
    const games = await this.gameService.fetchGames();
    this.games = games;
    this.isLoading = false;
  }

}
