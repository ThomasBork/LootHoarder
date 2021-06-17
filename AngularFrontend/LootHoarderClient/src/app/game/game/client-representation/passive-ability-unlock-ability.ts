import { AssetManagerService } from "./asset-manager.service";
import { PassiveAbility } from "./passive-ability";
import { PassiveAbilityParametersUnlockAbility } from "./passive-ability-parameters-unlock-ability";
import { PassiveAbilityType } from "./passive-ability-type";

export class PassiveAbilityUnlockAbility extends PassiveAbility {
  public type!: PassiveAbilityType;
  public parameters!: PassiveAbilityParametersUnlockAbility;

  public constructor(type: PassiveAbilityType, parameters: PassiveAbilityParametersUnlockAbility) {
    super(type, parameters);
  }

  public get description(): string {
    const abilityTypeKey: string = this.parameters.abilityTypeKey;
    const abilityType = AssetManagerService.instance.getAbilityType(abilityTypeKey);
    return `Unlocks the ${abilityType.name} ability`;
  }
}
