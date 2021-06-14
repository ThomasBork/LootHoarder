import { AbilityType } from "../ability-type";
import { AttributeValueSet } from "../attribute-value-set";

export class MonsterType {
  public key: string;
  public name: string;
  public abilityTypes: AbilityType[];
  public baseAttributes: AttributeValueSet;
  public attributesPerLevel: AttributeValueSet;

  public constructor(
    key: string,
    name: string,
    abilityTypes: AbilityType[],
    baseAttributes: AttributeValueSet,
    attributesPerLevel: AttributeValueSet
  ) {
    this.key = key;
    this.name = name;
    this.abilityTypes = abilityTypes;
    this.baseAttributes = baseAttributes;
    this.attributesPerLevel = attributesPerLevel;
  }
}