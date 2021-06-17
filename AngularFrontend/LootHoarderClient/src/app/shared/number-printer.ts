export class NumberPrinter {
  public static printFloorOnNthDecimal(number: number, n: number): string {
    const factor = Math.pow(10, n);
    const floatPrecisionRoundingFactor = 100000;
    return (
      Math.floor(
        (
          Math.round(number * floatPrecisionRoundingFactor) 
          / floatPrecisionRoundingFactor
        )
        * factor
      ) 
      / factor
    ).toString();
  }
}