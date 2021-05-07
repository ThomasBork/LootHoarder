import { ContractLoot } from "src/loot-hoarder-contract/contract-loot";
import { DbLoot } from "src/raw-game-state/db-loot";
import { Item } from "../item";

export class Loot {
  public items: Item[];
  private dbModel: DbLoot;

  public constructor(
    dbModel: DbLoot,
    items: Item[]
  ) {
    this.dbModel = dbModel;
    this.items = items;
  }

  public get gold(): number {
    return this.dbModel.gold;
  }
  
  public toContractModel(): ContractLoot {
    return {
      gold: this.gold,
      items: this.items.map(item => item.toContractModel())
    }
  }

  public static load(dbModel: DbLoot): Loot {
    const items = dbModel.items.map(dbItem => Item.load(dbItem));
    return new Loot(dbModel, items);
  }
}