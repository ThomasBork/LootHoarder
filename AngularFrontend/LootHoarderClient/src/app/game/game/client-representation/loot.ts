import { Item } from "./item";

export class Loot {
  public items: Item[];
  public gold: number;

  public constructor(
    items: Item[],
    gold: number
  ) {
    this.items = items;
    this.gold = gold;
  }
}