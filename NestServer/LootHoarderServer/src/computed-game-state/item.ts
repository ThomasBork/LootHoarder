import { ContractItem } from "src/loot-hoarder-contract/contract-item";
import { DbItem } from "src/raw-game-state/db-item";
import { StaticGameContentService } from "src/services/static-game-content-service";
import { PassiveAbility } from "./passive-ability";
import { ItemType } from "./item-type";
import { PassiveAbilityLoader } from "./passive-ability-loader";

export class Item {
  public dbModel: DbItem;
  public type: ItemType;
  public innateAbilities: PassiveAbility[];
  public additionalAbilities: PassiveAbility[];

  private constructor(dbModel: DbItem, type: ItemType, innateAbilities: PassiveAbility[], additionalAbilities: PassiveAbility[]) {
    this.dbModel = dbModel;
    this.type = type;
    this.innateAbilities = innateAbilities;
    this.additionalAbilities = additionalAbilities;
  }

  public get id(): number { return this.dbModel.id; }

  public getAllAbilities(): PassiveAbility[] {
    return this.innateAbilities.concat(this.additionalAbilities);
  }

  public toContractModel(): ContractItem {
    return {
      id: this.id,
      typeKey: this.type.key,
      innateAbilities: this.innateAbilities.map(ability => ability.toContractModel()),
      additionalAbilities: this.additionalAbilities.map(ability => ability.toContractModel())
    };
  }

  public static load (dbModel: DbItem): Item {
    const itemType = StaticGameContentService.instance.getItemType(dbModel.typeKey);
    const innateAbilities = dbModel.innateAbilities.map(dbPassiveAbility => PassiveAbilityLoader.loadAbility(dbPassiveAbility));
    const additionalAbilities = dbModel.additionalAbilities.map(dbPassiveAbility => PassiveAbilityLoader.loadAbility(dbPassiveAbility));
    const item = new Item(dbModel, itemType, innateAbilities, additionalAbilities);
    return item;
  }
}
