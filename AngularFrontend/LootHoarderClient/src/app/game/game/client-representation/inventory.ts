import { ContractInventoryPosition } from "src/loot-hoarder-contract/contract-inventory-position";
import { Item } from "./item";

export class Inventory {
  public head?: Item;
  public leftHand?: Item;
  public rightHand?: Item;
  public chest?: Item;
  public legs?: Item;
  public leftFoot?: Item;
  public rightFoot?: Item;

  public constructor(
    head: Item | undefined,
    leftHand: Item | undefined,
    rightHand: Item | undefined,
    chest: Item | undefined,
    legs: Item | undefined,
    leftFoot: Item | undefined,
    rightFoot: Item | undefined,
  ) {
    this.head = head;
    this.leftHand = leftHand;
    this.rightHand = rightHand;
    this.chest = chest;
    this.legs = legs;
    this.leftFoot = leftFoot;
    this.rightFoot = rightFoot;
  }
  
  public setItemAtPosition(item: Item | undefined, position: ContractInventoryPosition): void {
    switch(position) {
      case ContractInventoryPosition.head: {
        this.head = item;
      }
      break;
      case ContractInventoryPosition.leftHand: {
        this.leftHand = item;
      }
      break;
      case ContractInventoryPosition.rightHand: {
        this.rightHand = item;
      }
      break;
      case ContractInventoryPosition.chest: {
        this.chest = item;
      }
      break;
      case ContractInventoryPosition.legs: {
        this.legs = item;
      }
      break;
      case ContractInventoryPosition.leftFoot: {
        this.leftFoot = item;
      }
      break;
      case ContractInventoryPosition.rightFoot: {
        this.rightFoot = item;
      }
      break;
      default: throw Error (`Unhandled inventory position: ${position}`);
    }
  }
}
