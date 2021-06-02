import { HeroSkillTreeNode } from "./hero-skill-tree-node";
import { HeroType } from "./hero-type";

export class HeroSkillTreeStartingNode extends HeroSkillTreeNode {
  public heroType: HeroType;
  public constructor(
    x: number, 
    y: number,
    heroType: HeroType
  ) {
    super(x, y, 2, []);
    this.heroType = heroType;
  }
}