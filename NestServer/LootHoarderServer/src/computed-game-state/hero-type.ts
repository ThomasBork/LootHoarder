import { AbilityType } from "./ability-type";
import { AttributeSet } from "./attribute-set";
import { HeroSkillTreeNode } from "./hero-skill-tree-node";
import { ItemType } from "./item-type";

export class HeroType {
  public key: string;
  public name: string;
  public description: string;
  public abilityTypes: AbilityType[];
  public baseAttributes: AttributeSet;
  public attributesPerLevel: AttributeSet;
  public startItemType: ItemType;
  public startingSkillTreeNode: HeroSkillTreeNode;

  public constructor(
    key: string,
    name: string,
    description: string,
    abilityTypes: AbilityType[],
    baseAttributes: AttributeSet,
    attributesPerLevel: AttributeSet,
    startItemType: ItemType,
    startingSkillTreeNode: HeroSkillTreeNode
  ) {
    this.key = key;
    this.name = name;
    this.description = description;
    this.abilityTypes = abilityTypes;
    this.baseAttributes = baseAttributes;
    this.attributesPerLevel = attributesPerLevel;
    this.startItemType = startItemType;
    this.startingSkillTreeNode = startingSkillTreeNode;
  }
}