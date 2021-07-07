import { ContractItem } from "src/loot-hoarder-contract/contract-item";
import { DbItem } from "src/raw-game-state/db-item";
import { StaticGameContentService } from "src/services/static-game-content-service";
import { PassiveAbility } from "./passive-ability";
import { ItemType } from "./item-type";
import { ItemPassiveAbility } from "./item-passive-ability";

export class Item {
  public dbModel: DbItem;
  public type: ItemType;
  public innateAbilities: ItemPassiveAbility[];
  public additionalAbilities: ItemPassiveAbility[];
  public remainingCraftPotential: number;

  private constructor(dbModel: DbItem, type: ItemType, innateAbilities: ItemPassiveAbility[], additionalAbilities: ItemPassiveAbility[]) {
    this.dbModel = dbModel;
    this.type = type;
    this.innateAbilities = innateAbilities;
    this.additionalAbilities = additionalAbilities;

    let remainingCraftPotential = 0;
    for(let ability of additionalAbilities) {
      remainingCraftPotential += dbModel.level - ability.level;
    }
    this.remainingCraftPotential = remainingCraftPotential;
  }

  public get id(): number { return this.dbModel.id; }

  public getAllAbilities(): PassiveAbility[] {
    return this.innateAbilities
      .concat(this.additionalAbilities)
      .map(itemAbility => itemAbility.ability);
  }

  public toContractModel(): ContractItem {
    return {
      id: this.id,
      typeKey: this.type.key,
      innateAbilities: this.innateAbilities.map(ability => ability.toContractModel()),
      additionalAbilities: this.additionalAbilities.map(ability => ability.toContractModel()),
      level: this.dbModel.level,
      remainingCraftPotential: this.remainingCraftPotential,
    };
  }

  public static load (dbModel: DbItem): Item {
    const itemType = StaticGameContentService.instance.getItemType(dbModel.typeKey);
    const innateAbilities = dbModel.innateAbilities.map(dbPassiveAbility => ItemPassiveAbility.load(dbPassiveAbility));
    const additionalAbilities = dbModel.additionalAbilities.map(dbPassiveAbility => ItemPassiveAbility.load(dbPassiveAbility));
    const item = new Item(dbModel, itemType, innateAbilities, additionalAbilities);
    return item;
  }
}
