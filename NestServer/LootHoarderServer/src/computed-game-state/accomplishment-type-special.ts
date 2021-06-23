import { AccomplishmentType } from "./accomplishment-type";

export class AccomplishmentTypeSpecial extends AccomplishmentType {
  public description: string;
  public constructor(
    requiredAmount: number,
    description: string
  ) {
    super(requiredAmount);
    this.description = description;
  }
}
