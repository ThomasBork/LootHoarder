import { ContractItem } from "src/loot-hoarder-contract/contract-item";
import { DbItem } from "src/raw-game-state/db-item";
import { StaticGameContentService } from "src/services/static-game-content-service";
import { ItemAbility } from "./item-ability";
import { ItemType } from "./item-type";

export class Item {
  public dbModel: DbItem;
  public type: ItemType;
  public innateAbilities: ItemAbility[];
  public additionalAbilities: ItemAbility[];

  private constructor(dbModel: DbItem, type: ItemType, innateAbilities: ItemAbility[], additionalAbilities: ItemAbility[]) {
    this.dbModel = dbModel;
    this.type = type;
    this.innateAbilities = innateAbilities;
    this.additionalAbilities = additionalAbilities;
  }

  public get id(): number { return this.dbModel.id; }

  public getAllAbilities(): ItemAbility[] {
    return this.innateAbilities.concat(this.additionalAbilities);
  }

  public toContractModel(): ContractItem {
    return {
      id: this.id,
      typeKey: this.type.key,
      abilities: this.additionalAbilities.map(ability => ability.toContractModel())
    };
  }

  public static load (dbModel: DbItem): Item {
    const itemType = StaticGameContentService.instance.getItemType(dbModel.typeKey);
    const innateAbilities = dbModel.innateAbilities.map(dbItemAbility => ItemAbility.load(dbItemAbility));
    const additionalAbilities = dbModel.additionalAbilities.map(dbItemAbility => ItemAbility.load(dbItemAbility));
    const item = new Item(dbModel, itemType, innateAbilities, additionalAbilities);
    return item;
  }
}
