import { HeroSkillTreeNode } from "./hero-skill-tree-node";
import { SkillTreeTransition } from "./skill-tree-transition";

export class HeroSkillTree {
  public nodes: HeroSkillTreeNode[];
  public transitions: SkillTreeTransition[];
  public constructor(
    nodes: HeroSkillTreeNode[],
    transitions: SkillTreeTransition[],
  ) {
    this.nodes = nodes;
    this.transitions = transitions;
  }
}