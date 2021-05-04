import { ContractGameSettingType } from '../contract-game-setting-type'

export interface ContractSetSettingMessageContent {
  settingType: ContractGameSettingType;
  value: any;
}
