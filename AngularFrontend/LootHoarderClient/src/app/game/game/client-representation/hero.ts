import { ContractInventoryPosition } from "src/loot-hoarder-contract/contract-inventory-position";
import { AreaHero } from "./area-hero";
import { AttributeSet } from "./attribute-set";
import { HeroType } from "./hero-type";
import { Inventory } from "./inventory";
import { Item } from "./item";

export class Hero {
  public id: number;
  public type: HeroType;
  public name: string;
  public level: number;
  public experience: number;
  public areaHero?: AreaHero;
  public attributes: AttributeSet;
  public inventory: Inventory;

  public constructor(
    id: number,
    type: HeroType,
    name: string,
    level: number,
    experience: number,
    attributes: AttributeSet,
    inventory: Inventory,
  ) {
    this.id = id;
    this.type = type;
    this.name = name;
    this.level = level;
    this.experience = experience;
    this.attributes = attributes;
    this.inventory = inventory;
  }

  public equipItem(item: Item, inventoryPosition: ContractInventoryPosition): void {
    this.inventory.setItemAtPosition(item, inventoryPosition);
  }

  public unequipItem(inventoryPosition: ContractInventoryPosition): void {
    this.inventory.setItemAtPosition(undefined, inventoryPosition);
  }
}
