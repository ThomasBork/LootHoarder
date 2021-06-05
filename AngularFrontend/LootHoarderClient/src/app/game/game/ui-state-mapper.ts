import { Injectable } from "@angular/core";
import { ContractGame } from "src/loot-hoarder-contract/contract-game";
import { GameStateMapper } from "./game-state-mapper";
import { UIState } from "./client-representation/ui-state";
import { AuthService } from "src/app/auth/service/auth.service";

@Injectable()
export class UIStateMapper {
  public constructor(
    private readonly gameStateMapper: GameStateMapper,
    private readonly authService: AuthService
  ) {}

  public mapFromGame(contractGame: ContractGame): UIState {
    const game = this.gameStateMapper.mapToGame(contractGame);
    const login = this.authService.getLogin()!;
    const uiState = new UIState(login.userId, login.userName, game);
    return uiState;
  }
}
