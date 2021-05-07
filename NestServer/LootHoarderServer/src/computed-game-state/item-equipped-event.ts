import { ContractInventoryPosition } from "src/loot-hoarder-contract/contract-inventory-position";
import { Item } from "./item";

export class ItemEquippedEvent {
  public item: Item;
  public position: ContractInventoryPosition;
  public constructor(
    item: Item,
    position: ContractInventoryPosition,
  ) {
    this.item = item;
    this.position = position;
  }
}