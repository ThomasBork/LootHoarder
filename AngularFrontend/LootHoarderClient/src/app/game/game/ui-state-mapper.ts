import { Injectable } from "@angular/core";
import { ContractGame } from "src/loot-hoarder-contract/contract-game";
import { GameStateMapper } from "./game-state-mapper";
import { UIState } from "./client-representation/ui-state";

@Injectable()
export class UIStateMapper {
  public constructor(
    private readonly gameStateMapper: GameStateMapper
  ) {}

  public mapFromGame(contractGame: ContractGame): UIState {
    const game = this.gameStateMapper.mapToGame(contractGame);
    const uiState = new UIState(game);
    return uiState;
  }
}
