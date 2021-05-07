import { ContractInventoryPosition } from '../contract-inventory-position';

export interface ContractEquipItemMessageContent {
  heroId: number;
  itemId: number;
  inventoryPosition: ContractInventoryPosition;
}