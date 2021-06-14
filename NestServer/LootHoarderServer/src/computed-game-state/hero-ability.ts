import { DbHeroAbility } from "src/raw-game-state/db-hero-ability";
import { StaticGameContentService } from "src/services/static-game-content-service";
import { AbilityType } from "./ability-type";
import { ContractHeroAbility } from "src/loot-hoarder-contract/contract-hero-ability";

export class HeroAbility {
  private dbModel: DbHeroAbility;
  public type: AbilityType;

  private constructor(
    dbModel: DbHeroAbility,
    type: AbilityType
  ) {
    this.dbModel = dbModel;
    this.type = type;
  }

  public get id(): number { return this.dbModel.id; }
  public get isEnabled(): boolean { return this.dbModel.isEnabled; }

  public toContractModel(): ContractHeroAbility {
    return {
      id: this.id,
      isEnabled: this.isEnabled,
      typeKey: this.type.key
    };
  }

  public static load(dbModel: DbHeroAbility): HeroAbility {
    const abilityType = StaticGameContentService.instance.getAbilityType(dbModel.typeKey);
    return new HeroAbility(dbModel, abilityType);
  }
}
