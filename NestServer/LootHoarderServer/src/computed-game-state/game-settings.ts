import { DbGameSettings } from "src/raw-game-state/db-game-settings"
import {ContractGameSettingType} from 'src/loot-hoarder-contract/contract-game-setting-type'
import { ContractGameSettings } from "src/loot-hoarder-contract/contract-game-settings";

export class GameSettings {
  private dbModel: DbGameSettings;
  
  private constructor(
    dbModel: DbGameSettings
  ) {
    this.dbModel = dbModel;
  }

  public get automaticallyGoToNextCombat(): boolean { return this.dbModel.automaticallyGoToNextCombat; }
  public set automaticallyGoToNextCombat(newValue: boolean) { this.dbModel.automaticallyGoToNextCombat = newValue; }

  public get alwaysShowChat(): boolean { return this.dbModel.alwaysShowChat; }
  public set alwaysShowChat(newValue: boolean) { this.dbModel.alwaysShowChat = newValue; }

  public setSetting(settingType: ContractGameSettingType, settingValue: any): void {
    switch(settingType) {
      case ContractGameSettingType.automaticallyGoToNextCombat: {
        this.automaticallyGoToNextCombat = settingValue;
      }
      break;
      case ContractGameSettingType.alwaysShowChat: {
        this.alwaysShowChat = settingValue;
      }
      break;
      default: 
        throw Error ('Unknown setting type: ' + settingType);
    }
  }

  public getUIState(): ContractGameSettings {
    return {
      automaticallyGoToNextCombat: this.automaticallyGoToNextCombat,
      alwaysShowChat: this.alwaysShowChat
    };
  }

  public static load(dbModel: DbGameSettings): GameSettings {
    const gameSettings = new GameSettings(dbModel);

    return gameSettings;
  }
}
