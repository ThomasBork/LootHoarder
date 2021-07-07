import { ItemType } from "./item-type";
import { ItemPassiveAbility } from "./item-passive-ability";

export class Item {
  public id: number;
  public type: ItemType;
  public innateAbilities: ItemPassiveAbility[];
  public additionalAbilities: ItemPassiveAbility[];
  public level: number;
  public remainingCraftPotential: number;

  public constructor(
    id: number, 
    type: ItemType, 
    innateAbilities: ItemPassiveAbility[], 
    additionalAbilities: ItemPassiveAbility[],
    level: number,
    remainingCraftPotential: number
  ) {
    this.id = id;
    this.type = type;
    this.innateAbilities = innateAbilities;
    this.additionalAbilities = additionalAbilities;
    this.level = level;
    this.remainingCraftPotential = remainingCraftPotential;
  }
}
