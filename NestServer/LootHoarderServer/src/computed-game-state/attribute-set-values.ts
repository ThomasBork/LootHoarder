import { DbAttributeSet } from "src/raw-game-state/db-attribute-set";

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
    maximumHealth?: number,
    maximumMana?: number,
    attackPower?: number,
    spellPower?: number,
    attackSpeed?: number,
    castSpeed?: number,
    attackCooldownSpeed?: number,
    spellCooldownSpeed?: number,
    armor?: number,
    magicResistance?: number
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

  public toDbModel(): DbAttributeSet {
    return {
      maximumHealth: this.maximumHealth,
      maximumMana: this.maximumMana,
      attackPower: this.attackPower,
      spellPower: this.spellPower,
      attackSpeed: this.attackSpeed,
      castSpeed: this.castSpeed,
      attackCooldownSpeed: this.attackCooldownSpeed,
      spellCooldownSpeed: this.spellCooldownSpeed,
      armor: this.armor,
      magicResistance: this.magicResistance,
    };
  }
}