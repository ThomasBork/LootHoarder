import { Game } from "src/computed-game-state/game";
import { ContractInventoryPosition } from "src/loot-hoarder-contract/contract-inventory-position";

export class EquipItem {
  public constructor(
    public readonly game: Game,
    public readonly heroId: number,
    public readonly itemId: number,
    public readonly inventoryPosition: ContractInventoryPosition,
  ){}
}
