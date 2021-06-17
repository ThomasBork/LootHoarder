import { Pipe, PipeTransform } from "@angular/core";
import { NumberPrinter } from "../number-printer";

@Pipe({name: 'prettyNumber'})
export class PrettyNumberPipe implements PipeTransform {
  transform(value: number, precision: number = 0): string {
    return NumberPrinter.printFloorOnNthDecimal(value, precision);
  }
}