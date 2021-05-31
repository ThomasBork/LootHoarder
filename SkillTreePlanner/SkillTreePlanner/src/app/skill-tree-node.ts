import { SkillTreeNodeAbility } from "./skill-tree-node-ability";

export class SkillTreeNode {
  public x: number;
  public y: number;
  public abilities: SkillTreeNodeAbility[];
  public constructor(
    x: number,
    y: number,
    abilities: SkillTreeNodeAbility[]
  ) {
    this.x = x;
    this.y = y;
    this.abilities = abilities;
  }

  public getAbilitiesAsJson(): string {
    return JSON.stringify(this.abilities, null, 2);
  }
}
