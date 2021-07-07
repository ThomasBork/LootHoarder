export class ValueRange {
  public min: number;
  public max: number;
  public isInteger: boolean;
  public levelScaling: number;
  public constructor(min: number, max: number, isInteger: boolean, levelScaling: number) {
    this.min = min;
    this.max = max;
    this.isInteger = isInteger;
    this.levelScaling = levelScaling;
  }
}
