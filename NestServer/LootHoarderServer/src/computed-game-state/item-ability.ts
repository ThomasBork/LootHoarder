import { ContractItemAbility } from "src/loot-hoarder-contract/contract-item-ability";
import { DbItemAbility } from "src/raw-game-state/db-item-ability";
import { StaticGameContentService } from "src/services/static-game-content-service";
import { ItemAbilityType } from "./item-ability-type";

export class ItemAbility {
  private dbModel: DbItemAbility;
  public type: ItemAbilityType;
  public parameters: any;

  private constructor(dbModel: DbItemAbility, type: ItemAbilityType, parameters: any) {
    this.dbModel = dbModel;
    this.type = type;
    this.parameters = parameters;
  }

  public toContractModel(): ContractItemAbility {
    return {
      typeKey: this.type.key,
      parameters: this.parameters
    };
  }

  public static load(dbModel: DbItemAbility): ItemAbility {
    const abilityType = StaticGameContentService.instance.getItemAbilityType(dbModel.typeKey);
    const ability = new ItemAbility(dbModel, abilityType, dbModel.parameters);
    return ability;
  }
}