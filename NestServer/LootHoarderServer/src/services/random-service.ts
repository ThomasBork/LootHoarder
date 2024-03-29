import { Injectable } from "@nestjs/common";
import { WeightedElement } from "src/computed-game-state/weighted-element";

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

  public randomWeightedElement<T>(array: WeightedElement<T>[]): T {
    const totalWeight = array.map(a => a.weight).reduce((w1, w2) => w1 + w2, 0);
    const randomRoll = this.randomFloat(0, totalWeight);
    let remainingRoll = randomRoll;
    for(const weightedElement of array) {
      if (remainingRoll < weightedElement.weight) {
        return weightedElement.element;
      }

      remainingRoll -= weightedElement.weight;
    }

    throw Error ('Something went wrong when determining a random weighted element.');
  }

  public randomNWeightedElements<T>(array: WeightedElement<T>[], amount: number): T[] {
    if (amount > array.length) {
      throw Error(`Cannot choose ${amount} elements from an array with ${array.length} elements`);
    }
    if (amount === array.length) {
      return array.map(a => a.element);
    }
    const newArray = [...array];
    const returnArray: T[] = [];
    for(let i = 0; i<amount; i++) {
      const randomElement = this.randomWeightedElement(newArray);
      newArray.splice(newArray.findIndex(e => e.element === randomElement), 1);
      returnArray.push(randomElement);
    }
    return returnArray;
  }
}