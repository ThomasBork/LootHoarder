import { ContractHeroAbility } from "../contract-hero-ability";

export interface ContractHeroAbilityAddedMessageContent {
  heroId: number,
  ability: ContractHeroAbility
}
