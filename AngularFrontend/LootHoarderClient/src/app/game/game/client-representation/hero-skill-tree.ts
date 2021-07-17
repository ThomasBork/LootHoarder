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

  public getNeighborNodes(node: HeroSkillTreeNode): HeroSkillTreeNode[] {
    return this.nodes
      .filter(n => 
        this.transitions.some(t => 
          (
            t.fromX === node.x
            && t.fromY === node.y
            && t.toX === n.x
            && t.toY === n.y
          )
          || 
          (
            t.fromX === n.x
            && t.fromY === n.y
            && t.toX === node.x
            && t.toY === node.y
          )
        )
      );
  }
}