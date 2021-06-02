import { HeroSkillTreeNode } from "./hero-skill-tree-node";
import { HeroSkillTreeStartingNode } from "./hero-skill-tree-starting-node";

export class HeroSkillTreeNodeStatus {
  public node: HeroSkillTreeNode;
  public isAvailable: boolean;
  public isTaken: boolean;
  public abilityDescriptions: string[];
  public constructor(
    node: HeroSkillTreeNode,
    isAvailable: boolean,
    isTaken: boolean,
  ) {
    this.node = node;
    this.isAvailable = isAvailable;
    this.isTaken = isTaken;
    if (node instanceof HeroSkillTreeStartingNode) {
      this.abilityDescriptions = [`Starting location for the ${node.heroType.name}`];
    } else {
      this.abilityDescriptions = node.passiveAbilities.map(ability => ability.description);
    }
  }
}