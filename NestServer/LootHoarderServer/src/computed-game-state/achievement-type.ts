import { AccomplishmentType } from "./accomplishment-type";

export class AchievementType {
  public key: string;
  public name: string;
  public hideDescriptionUntilCompleted: boolean;
  public requiredAccomplishmentTypes: AccomplishmentType[];

  public constructor(
    key: string,
    name: string,
    hideDescriptionUntilCompleted: boolean,
    requiredAccomplishmentTypes: AccomplishmentType[]
  ) {
    this.key = key;
    this.name = name;
    this.hideDescriptionUntilCompleted = hideDescriptionUntilCompleted;
    this.requiredAccomplishmentTypes = requiredAccomplishmentTypes;
  }
}