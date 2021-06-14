import { AbilityType } from "./ability-type";
import { AttributeValueSet } from "./attribute-value-set";
import { HeroSkillTreeNode } from "./hero-skill-tree-node";
import { ItemType } from "./item-type";

export class HeroType {
  public key: string;
  public name: string;
  public description: string;
  public abilityTypes: AbilityType[];
  public baseAttributes: AttributeValueSet;
  public attributesPerLevel: AttributeValueSet;
  public startItemType: ItemType;
  public startingSkillTreeNode: HeroSkillTreeNode;

  public constructor(
    key: string,
    name: string,
    description: string,
    abilityTypes: AbilityType[],
    baseAttributes: AttributeValueSet,
    attributesPerLevel: AttributeValueSet,
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