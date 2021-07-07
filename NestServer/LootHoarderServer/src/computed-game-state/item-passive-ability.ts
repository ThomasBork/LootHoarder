import { PassiveAbility } from "./passive-ability";
import { PassiveAbilityLoader } from "./passive-ability-loader";
import { DbItemPassiveAbility } from "src/raw-game-state/db-item-passive-ability";
import { ContractItemPassiveAbility } from "src/loot-hoarder-contract/contract-item-passive-ability";

export class ItemPassiveAbility {
  public dbModel: DbItemPassiveAbility;
  public ability: PassiveAbility;

  private constructor(
    dbModel: DbItemPassiveAbility,
    ability: PassiveAbility,
  ) {
    this.dbModel = dbModel;
    this.ability = ability;
  }

  public get level(): number { return this.dbModel.level; }

  public toContractModel(): ContractItemPassiveAbility {
    return {
      level: this.level,
      ability: this.ability.toContractModel()
    };
  }

  public static load (dbModel: DbItemPassiveAbility): ItemPassiveAbility {
    const ability = PassiveAbilityLoader.loadAbility(dbModel.ability);
    const itemAbility = new ItemPassiveAbility(dbModel, ability);
    return itemAbility;
  }
}
