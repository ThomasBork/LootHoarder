import { ItemAbility } from "./item-ability";
import { ItemType } from "./item-type";

export class Item {
  public id: number;
  public type: ItemType;
  public abilities: ItemAbility[];

  public constructor(id: number, type: ItemType, abilities: ItemAbility[]) {
    this.id = id;
    this.type = type;
    this.abilities = abilities;
  }
}
