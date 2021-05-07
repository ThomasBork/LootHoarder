import { ContractAttributeType } from '../contract-attribute-type'

export interface ContractHeroAttributeChangedMessageContent {
  heroId: number,
  attributeType: ContractAttributeType,
  tag?: string,
  newAdditiveValue: number,
  newMultiplicativeValue: number,
  newValue: number
}
