import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConfigService } from "../../app-config.service";
import { AuthService } from "src/app/auth/service/auth.service";
import { GameForOverview } from "./game-for-overview";

@Injectable()
export class GameService {
  private apiUrl: string;

  public constructor(
    private readonly http: HttpClient,
    private readonly appConfigService: AppConfigService,
    private readonly authService: AuthService
  ) {
    this.apiUrl = appConfigService.apiUrl;
  }

  public fetchGames(): Promise<GameForOverview[]> {
    const endPoint = `${this.apiUrl}/game/games`;
    return this.http
      .get<{ games: GameForOverview[] }>(
        endPoint, 
        {
          headers: this.getAuthenticationHeaders()
        }
      )
      .toPromise()
      .then(result => result.games);
  }

  public createGame(): Promise<number> {
    const endPoint = `${this.apiUrl}/game/createGame`;
    const body = { };
    return this.http
      .post<{ gameId: number }>(
        endPoint,
        body,
        {
          headers: this.getAuthenticationHeaders()
        }
      )
      .toPromise()
      .then(result => result.gameId);
  }

  private getAuthenticationHeaders(): { [header: string]: string } {
    const authToken = this.authService.getAuthToken();
    if (!authToken) {
      throw Error ('Not logged in');
    }
    return {
      'authentication': authToken
    }
  }
}
