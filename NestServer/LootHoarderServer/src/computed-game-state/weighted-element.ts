export class WeightedElement<T> {
  public weight: number;
  public element: T;

  public constructor(weight: number, element: T) {
    this.weight = weight;
    this.element = element;
  }
}