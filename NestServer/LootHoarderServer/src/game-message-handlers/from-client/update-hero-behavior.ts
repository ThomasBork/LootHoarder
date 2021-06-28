import { Game } from "src/computed-game-state/game";
import { ContractCharacterBehavior } from "src/loot-hoarder-contract/contract-character-behavior";

export class UpdateHeroBehavior {
  public constructor(
    public readonly game: Game,
    public readonly heroId: number,
    public readonly behavior: ContractCharacterBehavior
  ){}
}