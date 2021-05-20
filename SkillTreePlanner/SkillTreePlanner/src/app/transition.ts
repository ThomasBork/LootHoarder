export class Transition {
  public fromX: number;
  public fromY: number;
  public toX: number;
  public toY: number;
  public constructor(
    fromX: number,
    fromY: number,
    toX: number,
    toY: number
  ) {
    this.fromX = fromX;
    this.fromY = fromY;
    this.toX = toX;
    this.toY = toY;
  }

  public get lowestX(): number { return this.fromX < this.toX ? this.fromX : this.toX; }
  public get lowestY(): number { return this.fromY < this.toY ? this.fromY : this.toY; }
}