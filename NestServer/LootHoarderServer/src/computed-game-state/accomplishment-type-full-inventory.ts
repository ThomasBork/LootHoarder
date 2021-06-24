import { AccomplishmentType } from "./accomplishment-type";

export class AccomplishmentTypeFullInventory extends AccomplishmentType {
  public constructor(
    requiredAmount: number,
  ) {
    super(requiredAmount);
  }
}
