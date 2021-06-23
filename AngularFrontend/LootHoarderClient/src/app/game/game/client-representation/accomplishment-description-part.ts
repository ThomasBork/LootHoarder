import { AccomplishmentDescriptionPartContent } from "./accomplishment-description-part-content";
import { AccomplishmentDescriptionPartTypeKey } from "./accomplishment-description-part-type-key";

export class AccomplishmentDescriptionPart {
  public typeKey: AccomplishmentDescriptionPartTypeKey;
  public content: AccomplishmentDescriptionPartContent;
  public constructor(
    typeKey: AccomplishmentDescriptionPartTypeKey,
    content: AccomplishmentDescriptionPartContent,
  ) {
    this.typeKey = typeKey;
    this.content = content;
  } 
}