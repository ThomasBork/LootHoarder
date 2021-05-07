import { Pipe, PipeTransform } from "@angular/core";

@Pipe({name: 'prettyNumber'})
export class PrettyNumberPipe implements PipeTransform {
  transform(value: number, precision: number = 0): string {
    return value.toFixed(precision);
  }
}