import { AbilityType } from "../client-representation/ability-type";
import { HeroSkillTreeStartingNode } from "./hero-skill-tree-starting-node";
import { ItemType } from "./item-type";

export class HeroType {
  public key: string;
  public name: string;
  public description: string;
  public abilityTypes: AbilityType[];
  public startingWeaponType: ItemType;
  public get heroSkillTreeStartingNode(): HeroSkillTreeStartingNode {
    if (!this._heroSkillTreeStartingNode) {
      throw Error (`Tried to read from heroSkillTreeStartingNode before it was set.`);
    }
    return this._heroSkillTreeStartingNode;
  }
  public set heroSkillTreeStartingNode(newValue: HeroSkillTreeStartingNode) {
    this._heroSkillTreeStartingNode = newValue;
  }

  private _heroSkillTreeStartingNode?: HeroSkillTreeStartingNode;
  public constructor(
    key: string,
    name: string,
    description: string,
    abilityTypes: AbilityType[],
    startingWeaponType: ItemType
  ) {
    this.key = key;
    this.name = name;
    this.description = description;
    this.abilityTypes = abilityTypes;
    this.startingWeaponType = startingWeaponType;
  }
}