import { ContractHeroAbilityValueKey } from "../contract-hero-ability-value-key";

export interface ContractHeroAbilityValueChangedMessageContent {
  heroId: number,
  abilityId: number,
  valueKey: ContractHeroAbilityValueKey,
  effectIndex?: number,
  newValue: number
}
