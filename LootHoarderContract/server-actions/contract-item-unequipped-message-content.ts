import { ContractInventoryPosition } from '../contract-inventory-position';

export interface ContractItemUnequippedMessageContent {
  heroId: number;
  itemId: number;
  position: ContractInventoryPosition;
}
