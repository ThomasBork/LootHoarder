import { HeroSkillTreeNodeStatus } from "./hero-skill-tree-node-status";
import { SkillTreeTransition } from "./skill-tree-transition";

export class HeroSkillTreeStatus {
  public nodesWithStatus: HeroSkillTreeNodeStatus[];
  public transitions: SkillTreeTransition[];
  public constructor(
    nodesWithStatus: HeroSkillTreeNodeStatus[],
    transitions: SkillTreeTransition[]
  ) {
    this.nodesWithStatus = nodesWithStatus;
    this.transitions = transitions;
  }

  public getNode(x: number, y: number): HeroSkillTreeNodeStatus {
    const node = this.nodesWithStatus.find(statusNode => 
      statusNode.node.x === x
      && statusNode.node.y === y
    );
    if (!node) { 
      throw Error (`Node could not be matched from coordinates: (${x}, ${y})`);
    }
    return node;
  }
}