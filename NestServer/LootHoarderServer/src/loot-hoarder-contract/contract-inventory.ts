import { ContractItem } from "./contract-item";

export interface ContractInventory {
  head?: ContractItem;
  leftHand?: ContractItem;
  rightHand?: ContractItem;
  chest?: ContractItem;
  legs?: ContractItem;
  leftFoot?: ContractItem;
  rightFoot?: ContractItem;
}