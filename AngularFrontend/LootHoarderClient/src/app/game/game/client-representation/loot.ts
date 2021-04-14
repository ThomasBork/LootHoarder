export class Loot {
  public items: [];
  public gold: number;

  public constructor(
    items: [],
    gold: number
  ) {
    this.items = items;
    this.gold = gold;
  }
}