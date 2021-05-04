import { Game } from "src/computed-game-state/game";
import { ContractGameSettingType } from "src/loot-hoarder-contract/contract-game-setting-type";

export class SetSetting {
  public constructor(
    public readonly game: Game,
    public readonly type: ContractGameSettingType,
    public readonly value: any
  ){}
}