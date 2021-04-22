import { DbAttributeSet } from "src/raw-game-state/db-attribute-set";
import { AttributeSetValues } from "./attribute-set-values";
import { ValueContainer } from "./value-container";

export class AttributeSet {
  public maximumHealthVC: ValueContainer;
  public maximumManaVC: ValueContainer;
  public attackPowerVC: ValueContainer;
  public spellPowerVC: ValueContainer;
  public attackSpeedVC: ValueContainer;
  public castSpeedVC: ValueContainer;
  public attackCooldownSpeedVC: ValueContainer;
  public spellCooldownSpeedVC: ValueContainer;
  public armorVC: ValueContainer;
  public magicResistanceVC: ValueContainer;

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
    this.maximumHealthVC = new ValueContainer(settings?.maximumHealth ?? 0);
    this.maximumManaVC = new ValueContainer(settings?.maximumMana ?? 0);
    this.attackPowerVC = new ValueContainer(settings?.attackPower ?? 0);
    this.spellPowerVC = new ValueContainer(settings?.spellPower ?? 0);
    this.attackSpeedVC = new ValueContainer(settings?.attackSpeed ?? 0);
    this.castSpeedVC = new ValueContainer(settings?.castSpeed ?? 0);
    this.attackCooldownSpeedVC = new ValueContainer(settings?.attackCooldownSpeed ?? 0);
    this.spellCooldownSpeedVC = new ValueContainer(settings?.spellCooldownSpeed ?? 0);
    this.armorVC = new ValueContainer(settings?.armor ?? 0);
    this.magicResistanceVC = new ValueContainer(settings?.magicResistance ?? 0);
  }

  public getValues(): AttributeSetValues {
    const values = new AttributeSetValues({
      maximumHealth: this.maximumHealthVC.value,
      maximumMana: this.maximumManaVC.value,
      attackPower: this.attackPowerVC.value,
      spellPower: this.spellPowerVC.value,
      attackSpeed: this.attackSpeedVC.value,
      castSpeed: this.castSpeedVC.value,
      attackCooldownSpeed: this.attackCooldownSpeedVC.value,
      spellCooldownSpeed: this.spellCooldownSpeedVC.value,
      armor: this.armorVC.value,
      magicResistance: this.magicResistanceVC.value,
    });

    return values;
  }

  public setAdditiveValueContainers(attributesToAdd: AttributeSet): void {
    this.maximumHealthVC.setAdditiveValueContainer(attributesToAdd.maximumHealthVC);
    this.maximumManaVC.setAdditiveValueContainer(attributesToAdd.maximumManaVC);
    this.attackPowerVC.setAdditiveValueContainer(attributesToAdd.attackPowerVC);
    this.spellPowerVC.setAdditiveValueContainer(attributesToAdd.spellPowerVC);
    this.attackSpeedVC.setAdditiveValueContainer(attributesToAdd.attackSpeedVC);
    this.castSpeedVC.setAdditiveValueContainer(attributesToAdd.castSpeedVC);
    this.attackCooldownSpeedVC.setAdditiveValueContainer(attributesToAdd.attackCooldownSpeedVC);
    this.spellCooldownSpeedVC.setAdditiveValueContainer(attributesToAdd.spellCooldownSpeedVC);
    this.armorVC.setAdditiveValueContainer(attributesToAdd.armorVC);
    this.magicResistanceVC.setAdditiveValueContainer(attributesToAdd.magicResistanceVC);
  }

  public setMultiplicativeModifier(key: any, modifier: number): void {
    this.maximumHealthVC.setMultiplicativeModifier(key, modifier);
    this.maximumManaVC.setMultiplicativeModifier(key, modifier);
    this.attackPowerVC.setMultiplicativeModifier(key, modifier);
    this.spellPowerVC.setMultiplicativeModifier(key, modifier);
    this.attackSpeedVC.setMultiplicativeModifier(key, modifier);
    this.castSpeedVC.setMultiplicativeModifier(key, modifier);
    this.attackCooldownSpeedVC.setMultiplicativeModifier(key, modifier);
    this.spellCooldownSpeedVC.setMultiplicativeModifier(key, modifier);
    this.armorVC.setMultiplicativeModifier(key, modifier);
    this.magicResistanceVC.setMultiplicativeModifier(key, modifier);
  }
  
  public static load(dbModel: DbAttributeSet): AttributeSet {
    const attributeSet: AttributeSet = new AttributeSet(dbModel);
    return attributeSet;
  }
}