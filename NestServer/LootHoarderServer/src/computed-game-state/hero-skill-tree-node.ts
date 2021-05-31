import { PassiveAbility } from "./passive-ability";

export class HeroSkillTreeNode {
  public x: number;
  public y: number;
  public passiveAbilities: PassiveAbility[];
  public neighborNodes: HeroSkillTreeNode[];
  public constructor(
    x: number, 
    y: number,
    passiveAbilities: PassiveAbility[]
  ) {
    this.x = x;
    this.y = y;
    this.passiveAbilities = passiveAbilities;

    this.neighborNodes = [];
  }

  public addNeighborNode(node: HeroSkillTreeNode): void {
    this.neighborNodes.push(node);
  }
}