import { PassiveAbility } from "./passive-ability";

export class HeroSkillTreeNode {
  public x: number;
  public y: number;
  public size: number;
  public passiveAbilities: PassiveAbility[];
  public constructor(
    x: number,
    y: number,
    size: number,
    passiveAbilities: PassiveAbility[]
  ) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.passiveAbilities = passiveAbilities;
  }
}