import { PassiveAbility } from "./passive-ability";
import { ItemType } from "./item-type";

export class Item {
  public id: number;
  public type: ItemType;
  public innateAbilities: PassiveAbility[];
  public additionalAbilities: PassiveAbility[];

  public constructor(id: number, type: ItemType, innateAbilities: PassiveAbility[], additionalAbilities: PassiveAbility[]) {
    this.id = id;
    this.type = type;
    this.innateAbilities = innateAbilities;
    this.additionalAbilities = additionalAbilities;
  }
}
