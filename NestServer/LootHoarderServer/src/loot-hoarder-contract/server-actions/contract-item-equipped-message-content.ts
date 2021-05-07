import { ContractItem } from '../contract-item';
import { ContractInventoryPosition } from '../contract-inventory-position';

export interface ContractItemEquippedMessageContent {
  heroId: number;
  item: ContractItem;
  position: ContractInventoryPosition;
}
