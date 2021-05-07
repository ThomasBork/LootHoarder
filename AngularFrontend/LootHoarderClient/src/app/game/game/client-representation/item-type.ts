import { ContractItemCategory } from "src/loot-hoarder-contract/contract-item-category"

export class ItemType {
  public key: string;
  public name: string;
  public category: ContractItemCategory;
  public fixtureLeft: number;
  public fixtureTop: number;
  public imageWidthInPercent: number;

  public constructor(
    key: string,
    name: string,
    category: ContractItemCategory,
    fixtureLeft: number,
    fixtureTop: number,
    imageWidthInPercent: number,
  ) {
    this.key = key;
    this.name = name;
    this.category = category;
    this.fixtureLeft = fixtureLeft;
    this.fixtureTop = fixtureTop;
    this.imageWidthInPercent = imageWidthInPercent;
  }
}
