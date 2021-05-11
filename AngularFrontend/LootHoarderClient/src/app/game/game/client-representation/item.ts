import { ItemAbility } from "./item-ability";
import { ItemType } from "./item-type";

export class Item {
  public id: number;
  public type: ItemType;
  public innateAbilities: ItemAbility[];
  public additionalAbilities: ItemAbility[];

  public constructor(id: number, type: ItemType, innateAbilities: ItemAbility[], additionalAbilities: ItemAbility[]) {
    this.id = id;
    this.type = type;
    this.innateAbilities = innateAbilities;
    this.additionalAbilities = additionalAbilities;
  }
}
