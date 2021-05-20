import { ContractAttributeType } from '../contract-attribute-type'

export interface ContractHeroAttributeChangedMessageContent {
  heroId: number,
  attributeType: ContractAttributeType,
  tags: string[],
  newAdditiveValue: number,
  newMultiplicativeValue: number,
  newValue: number
}
