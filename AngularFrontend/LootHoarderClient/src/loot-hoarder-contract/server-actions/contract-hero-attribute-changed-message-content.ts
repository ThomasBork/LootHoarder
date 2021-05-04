import { ContractAttributeType } from '../contract-attribute-type'

export interface ContractHeroAttributeChangedMessageContent {
  heroId: number,
  attributeType: ContractAttributeType,
  newValue: number
}
