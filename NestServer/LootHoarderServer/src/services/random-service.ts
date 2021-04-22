import { Injectable } from "@nestjs/common";

@Injectable()
export class RandomService {
  public randomElementInArray<T>(array: T[]): T {
    if (array.length === 0) {
      throw Error('Cannot choose random element from an empty array.');
    }

    return array[this.randomInteger(0, array.length - 1)];
  }

  public randomInteger(min: number, max: number): number {
    return Math.floor(this.randomFloat(min, max + 1));
  }

  public randomFloat(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }
}