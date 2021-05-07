import { Subject } from "rxjs";
import { ContractInventory } from "src/loot-hoarder-contract/contract-inventory";
import { ContractInventoryPosition } from "src/loot-hoarder-contract/contract-inventory-position";
import { DbInventory } from "src/raw-game-state/db-inventory";
import { Item } from "./item";
import { ItemEquippedEvent } from "./item-equipped-event";
import { ItemUnequippedEvent } from "./item-unequipped-event";

export class Inventory {
  public head?: Item;
  public leftHand?: Item;
  public rightHand?: Item;
  public chest?: Item;
  public legs?: Item;
  public leftFoot?: Item;
  public rightFoot?: Item;
  public onItemEquipped: Subject<ItemEquippedEvent>;
  public onItemUnequipped: Subject<ItemUnequippedEvent>;

  private dbModel: DbInventory;

  private constructor(
    dbModel: DbInventory,
    head: Item | undefined,
    leftHand: Item | undefined,
    rightHand: Item | undefined,
    chest: Item | undefined,
    legs: Item | undefined,
    leftFoot: Item | undefined,
    rightFoot: Item | undefined,
  ) {
    this.dbModel = dbModel;
    this.head = head;
    this.leftHand = leftHand;
    this.rightHand = rightHand;
    this.chest = chest;
    this.legs = legs;
    this.leftFoot = leftFoot;
    this.rightFoot = rightFoot;

    this.onItemEquipped = new Subject();
    this.onItemUnequipped = new Subject();
  }

  public getItemAtPosition(position: ContractInventoryPosition): Item | undefined {
    switch(position) {
      case ContractInventoryPosition.head: return this.head;
      case ContractInventoryPosition.leftHand: return this.leftHand;
      case ContractInventoryPosition.rightHand: return this.rightHand;
      case ContractInventoryPosition.chest: return this.chest;
      case ContractInventoryPosition.legs: return this.legs;
      case ContractInventoryPosition.leftFoot: return this.leftFoot;
      case ContractInventoryPosition.rightFoot: return this.rightFoot;
      default: throw Error (`Unhandled inventory position: ${position}`);
    }
  }

  public getAllItems(): Item[] {
    const itemsOrUndefined = [
      this.head,
      this.leftHand,
      this.rightHand,
      this.chest,
      this.legs,
      this.leftFoot,
      this.rightFoot
    ];
    const items = itemsOrUndefined.filter(i => i !== undefined);
    return items as Item[];
  }

  public setItemAtPosition(item: Item | undefined, position: ContractInventoryPosition): void {
    const previousItem = this.getItemAtPosition(position);
    switch(position) {
      case ContractInventoryPosition.head: {
        this.head = item;
        this.dbModel.head = item?.dbModel;
      }
      break;
      case ContractInventoryPosition.leftHand: {
        this.leftHand = item;
        this.dbModel.leftHand = item?.dbModel;
      }
      break;
      case ContractInventoryPosition.rightHand: {
        this.rightHand = item;
        this.dbModel.rightHand = item?.dbModel;
      }
      break;
      case ContractInventoryPosition.chest: {
        this.chest = item;
        this.dbModel.chest = item?.dbModel;
      }
      break;
      case ContractInventoryPosition.legs: {
        this.legs = item;
        this.dbModel.legs = item?.dbModel;
      }
      break;
      case ContractInventoryPosition.leftFoot: {
        this.leftFoot = item;
        this.dbModel.leftFoot = item?.dbModel;
      }
      break;
      case ContractInventoryPosition.rightFoot: {
        this.rightFoot = item;
        this.dbModel.rightFoot = item?.dbModel;
      }
      break;
      default: throw Error (`Unhandled inventory position: ${position}`);
    }
    
    if (previousItem) {
      this.onItemUnequipped.next(new ItemUnequippedEvent(previousItem, position));
    }

    if (item) {
      this.onItemEquipped.next(new ItemEquippedEvent(item, position));
    } 
  }

  public toContractModel(): ContractInventory {
    return {
      chest: this.chest?.toContractModel(),
      head: this.head?.toContractModel(),
      leftFoot: this.leftFoot?.toContractModel(),
      leftHand: this.leftHand?.toContractModel(),
      legs: this.legs?.toContractModel(),
      rightFoot: this.rightFoot?.toContractModel(),
      rightHand: this.rightHand?.toContractModel()
    };
  }

  public static load(dbModel: DbInventory): Inventory {
    const headItem = dbModel.head ? Item.load(dbModel.head) : undefined;
    const leftHandItem = dbModel.leftHand ? Item.load(dbModel.leftHand) : undefined;
    const rightHandItem = dbModel.rightHand ? Item.load(dbModel.rightHand) : undefined;
    const chestItem = dbModel.chest ? Item.load(dbModel.chest) : undefined;
    const legsItem = dbModel.legs ? Item.load(dbModel.legs) : undefined;
    const leftFootItem = dbModel.leftFoot ? Item.load(dbModel.leftFoot) : undefined;
    const rightFootItem = dbModel.rightFoot ? Item.load(dbModel.rightFoot) : undefined;

    const inventory = new Inventory(
      dbModel, 
      headItem, 
      leftHandItem,
      rightHandItem,
      chestItem,
      legsItem,
      leftFootItem,
      rightFootItem
    );

    return inventory;
  }
}
