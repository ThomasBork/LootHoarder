import { ContractAttributeType } from "src/loot-hoarder-contract/contract-attribute-type";

export class AttributeTypeTranslator {
  public static translate(attributeType: ContractAttributeType): string {
    switch(attributeType) {
      case ContractAttributeType.cooldownSpeed: return 'Cooldown Speed';
      case ContractAttributeType.maximumHealth: return 'Maximum Health';
      case ContractAttributeType.maximumMana: return 'Maximum Mana';
      case ContractAttributeType.power: return 'Power';
      case ContractAttributeType.resistance: return 'Resistance';
      case ContractAttributeType.useSpeed: return 'Use Speed';
      default: throw Error (`No translation found for attribute type: ${attributeType}`);
    }
  }
}