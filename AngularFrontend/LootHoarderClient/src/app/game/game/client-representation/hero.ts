import { ContractInventoryPosition } from "src/loot-hoarder-contract/contract-inventory-position";
import { AreaHero } from "./area-hero";
import { AttributeSet } from "./attribute-set";
import { HeroAbility } from "./hero-ability";
import { HeroSkillTreeStatus } from "./hero-skill-tree-status";
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
  public eyesId: number;
  public noseId: number;
  public mouthId: number;
  public unspentSkillPoints: number;
  public skillTree: HeroSkillTreeStatus;
  public abilities: HeroAbility[];

  public constructor(
    id: number,
    type: HeroType,
    name: string,
    level: number,
    experience: number,
    attributes: AttributeSet,
    inventory: Inventory,
    eyesId: number,
    noseId: number,
    mouthId: number,
    unspentSkillPoints: number,
    skillTree: HeroSkillTreeStatus,
    abilities: HeroAbility[],
  ) {
    this.id = id;
    this.type = type;
    this.name = name;
    this.level = level;
    this.experience = experience;
    this.attributes = attributes;
    this.inventory = inventory;
    this.eyesId = eyesId;
    this.noseId = noseId;
    this.mouthId = mouthId;
    this.unspentSkillPoints = unspentSkillPoints;
    this.skillTree = skillTree;
    this.abilities = abilities;
  }

  public equipItem(item: Item, inventoryPosition: ContractInventoryPosition): void {
    this.inventory.setItemAtPosition(item, inventoryPosition);
  }

  public unequipItem(inventoryPosition: ContractInventoryPosition): void {
    this.inventory.setItemAtPosition(undefined, inventoryPosition);
  }

  public addAbility(ability: HeroAbility): void {
    this.abilities.push(ability);
  }

  public removeAbility(abilityId: number): void {
    const index = this.abilities.findIndex(ability => ability.id === abilityId);
    if (index >= 0) {
      this.abilities.splice(index, 1);
    }
  }
}
