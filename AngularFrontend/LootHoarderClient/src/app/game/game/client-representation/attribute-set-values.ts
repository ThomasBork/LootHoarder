import { ContractAttributeType } from "src/loot-hoarder-contract/contract-attribute-type";

export class AttributeSetValues {
  public maximumHealth: number;
  public maximumMana: number;
  public attackPower: number;
  public spellPower: number;
  public attackSpeed: number;
  public castSpeed: number;
  public attackCooldownSpeed: number;
  public spellCooldownSpeed: number;
  public armor: number;
  public magicResistance: number;

  public constructor(settings?: {
    maximumHealth: number,
    maximumMana: number,
    attackPower: number,
    spellPower: number,
    attackSpeed: number,
    castSpeed: number,
    attackCooldownSpeed: number,
    spellCooldownSpeed: number,
    armor: number,
    magicResistance: number
  }) {
    this.maximumHealth = settings?.maximumHealth ?? 0;
    this.maximumMana = settings?.maximumMana ?? 0;
    this.attackPower = settings?.attackPower ?? 0;
    this.spellPower = settings?.spellPower ?? 0;
    this.attackSpeed = settings?.attackSpeed ?? 0;
    this.castSpeed = settings?.castSpeed ?? 0;
    this.attackCooldownSpeed = settings?.attackCooldownSpeed ?? 0;
    this.spellCooldownSpeed = settings?.spellCooldownSpeed ?? 0;
    this.armor = settings?.armor ?? 0;
    this.magicResistance = settings?.magicResistance ?? 0;
  }

  public setAttribute(attributeType: ContractAttributeType, value: number): void {
    switch(attributeType) {
      case ContractAttributeType.maximumHealth: this.maximumHealth = value;
      break;
      case ContractAttributeType.maximumMana: this.maximumMana = value;
      break;
      case ContractAttributeType.attackPower: this.attackPower = value;
      break;
      case ContractAttributeType.spellPower: this.spellPower = value;
      break;
      case ContractAttributeType.attackSpeed: this.attackSpeed = value;
      break;
      case ContractAttributeType.castSpeed: this.castSpeed = value;
      break;
      case ContractAttributeType.attackCooldownSpeed: this.attackCooldownSpeed = value;
      break;
      case ContractAttributeType.spellCooldownSpeed: this.spellCooldownSpeed = value;
      break;
      case ContractAttributeType.armor: this.armor = value;
      break;
      case ContractAttributeType.magicResistance: this.magicResistance = value;
      break;
      default:
        throw Error (`Unknown attribute type: ${attributeType}`);
    }
  }
}