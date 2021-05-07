import { ContractInventoryPosition } from "src/loot-hoarder-contract/contract-inventory-position";

export class ItemVisualPosition {
  public inventoryPosition: ContractInventoryPosition;
  public left: number;
  public top: number;
  public width: number;
  public height: number;
  public allowDrop: boolean;
  public draggedOver: boolean;
  public fixtureLeft: number;
  public fixtureTop: number;

  public constructor(
    inventoryPosition: ContractInventoryPosition,
    left: number,
    top: number,
    width: number,
    height: number,
    fixtureLeft: number,
    fixtureTop: number,
  ) {
    this.inventoryPosition = inventoryPosition;
    this.left = left;
    this.top = top;
    this.width = width;
    this.height = height;
    this.allowDrop = false;
    this.draggedOver = false;
    this.fixtureLeft = fixtureLeft;
    this.fixtureTop = fixtureTop;
  }
}
