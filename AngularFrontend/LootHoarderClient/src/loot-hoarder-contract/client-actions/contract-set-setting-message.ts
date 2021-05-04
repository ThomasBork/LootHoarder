import { ContractGameSettingType } from '../contract-game-setting-type';
import { ContractClientMessageType } from './contract-client-message-type';
import { ContractClientWebSocketMessage } from './contract-client-web-socket-message';
import { ContractSetSettingMessageContent } from './contract-set-setting-message-content';

export class ContractSetSettingMessage implements ContractClientWebSocketMessage<ContractSetSettingMessageContent> {
  public typeKey: ContractClientMessageType;
  public data: ContractSetSettingMessageContent;
  public constructor(settingType: ContractGameSettingType, value: any) {
    this.typeKey = ContractClientMessageType.setSetting;
    this.data = { 
      settingType, 
      value
    };
  }
}
