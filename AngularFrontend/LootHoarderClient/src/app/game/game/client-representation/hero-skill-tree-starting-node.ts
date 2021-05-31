import { HeroSkillTreeNode } from "./hero-skill-tree-node";

export class HeroSkillTreeStartingNode extends HeroSkillTreeNode {
  public heroTypeKey: string;
  public constructor(
    x: number, 
    y: number,
    heroTypeKey: string
  ) {
    super(x, y, []);
    this.heroTypeKey = heroTypeKey;
  }
}