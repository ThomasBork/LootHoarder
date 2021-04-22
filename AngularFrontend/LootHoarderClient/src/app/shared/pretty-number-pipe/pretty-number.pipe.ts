import { Pipe, PipeTransform } from "@angular/core";

@Pipe({name: 'prettyNumber'})
export class PrettyNumberPipe implements PipeTransform {
  transform(value: number, precision: number = 0): string {
    const precisionFactor = Math.pow(10, precision);
    return (Math.floor(value * precisionFactor) / precisionFactor).toString();
  }
}