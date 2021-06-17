import { ContractServerWebSocketMessage } from "./contract-server-web-socket-message";
import { ContractServerMessageType } from "./contract-server-message-type";
import { ContractHeroAbilityValueChangedMessageContent } from "./contract-hero-ability-value-changed-message-content";
import { ContractHeroAbilityValueKey } from "../contract-hero-ability-value-key";

export class ContractHeroAbilityValueChangedMessage implements ContractServerWebSocketMessage<ContractHeroAbilityValueChangedMessageContent> {
  public typeKey: ContractServerMessageType;
  public data: ContractHeroAbilityValueChangedMessageContent;
  public constructor(  
    heroId: number,
    abilityId: number,
    valueKey: ContractHeroAbilityValueKey,
    effectIndex: number | undefined,
    newValue: number
  ) {
    this.typeKey = ContractServerMessageType.heroAbilityValueChanged;
    this.data = { 
      heroId,
      abilityId,
      valueKey,
      effectIndex,
      newValue
    };
  }
}
