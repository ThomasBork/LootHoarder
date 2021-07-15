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
      case ContractAttributeType.damageTaken: return 'Damage Taken';
      case ContractAttributeType.criticalStrikeChance: return 'Critical Strike Chance';
      case ContractAttributeType.criticalStrikeMultiplier: return 'Critical Strike Multiplier';
      case ContractAttributeType.experienceGain: return 'Experience Gain';
      case ContractAttributeType.healthRecoveryPerSecond: return 'Health Recovery Per Second';
      case ContractAttributeType.manaRecoveryPerSecond: return 'Mana Recovery Per Second';
      case ContractAttributeType.itemDropChance: return 'Item Drop Chance';
      default: throw Error (`No translation found for attribute type: ${attributeType}`);
    }
  }
}