export class ValueRange {
  public min: number;
  public max: number;
  public isInteger: boolean;
  public constructor(min: number, max: number, isInteger: boolean) {
    this.min = min;
    this.max = max;
    this.isInteger = isInteger;
  }
}
