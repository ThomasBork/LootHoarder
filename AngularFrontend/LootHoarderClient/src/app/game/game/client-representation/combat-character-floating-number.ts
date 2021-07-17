export class CombatCharacterFloatingNumber {
  public number: number;
  public isDamage: boolean;
  public x: number;
  public y: number;
  public totalDuration: number;
  public durationLeft: number;

  public constructor(
    number: number,
    isDamage: boolean,
    x: number,
    y: number,
    totalDuration: number,
    durationLeft: number,
  ) {
    this.number = number;
    this.isDamage = isDamage;
    this.x = x;
    this.y = y;
    this.totalDuration = totalDuration;
    this.durationLeft = durationLeft;
  }
}
