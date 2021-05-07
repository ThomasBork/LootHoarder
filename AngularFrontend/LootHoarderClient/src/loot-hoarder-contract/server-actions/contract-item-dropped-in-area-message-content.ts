import { ContractItem } from '../contract-item'

export interface ContractItemDroppedInAreaMessageContent {
  areaId: number;
  item: ContractItem;
}
