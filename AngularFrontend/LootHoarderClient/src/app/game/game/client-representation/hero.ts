import { ContractInventoryPosition } from "src/loot-hoarder-contract/contract-inventory-position";
import { AreaHero } from "./area-hero";
import { AttributeSet } from "./attribute-set";
import { CharacterBehavior } from "./character-behavior/character-behavior";
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
  public behaviors: CharacterBehavior[];
  public currentBehavior?: CharacterBehavior;

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
    behaviors: CharacterBehavior[],
    currentBehavior: CharacterBehavior | undefined
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
    this.behaviors = behaviors;
    this.currentBehavior = currentBehavior;
  }

  public get experienceRequiredForNextLevel(): number {
    return Math.pow(this.level, 1.25) * 100;
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

  public getAbility(abilityId: number): HeroAbility {
    const ability = this.abilities.find(ability => ability.id === abilityId);
    if (!ability) {
      throw Error (`Hero ability with id ${abilityId} was not found.`);
    }
    return ability;
  }

  public removeAbility(abilityId: number): void {
    const index = this.abilities.findIndex(ability => ability.id === abilityId);
    if (index >= 0) {
      this.abilities.splice(index, 1);
    }
  }

  public getBehavior(behaviorId: number): CharacterBehavior {
    const behavior = this.behaviors.find(b => b.id === behaviorId);
    if (!behavior) {
      throw Error (`Behavior with id ${behaviorId} was not found.`);
    }
    return behavior;
  }
}
