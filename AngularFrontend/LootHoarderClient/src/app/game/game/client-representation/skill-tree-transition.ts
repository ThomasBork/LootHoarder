export class SkillTreeTransition {
  public fromX: number;
  public fromY: number;
  public toX: number;
  public toY: number;

  public constructor(
    fromX: number,
    fromY: number,
    toX: number,
    toY: number,
  ) {
    this.fromX = fromX;
    this.fromY = fromY;
    this.toX = toX;
    this.toY = toY;
  }

  public get minX(): number { 
    return this.fromX < this.toX ? this.fromX : this.toX;
  }

  public get minY(): number { 
    return this.fromY < this.toY ? this.fromY : this.toY;
  }

  public get maxX(): number { 
    return this.fromX < this.toX ? this.toX : this.fromX;
  }

  public get maxY(): number { 
    return this.fromY < this.toY ? this.toY : this.fromY;
  }

  public get isHorizontal(): boolean {
    return this.fromY === this.toY;
  }
}