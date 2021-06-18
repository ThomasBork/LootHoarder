import { Component, Input } from '@angular/core';
import { ContractGameSettingType } from 'src/loot-hoarder-contract/contract-game-setting-type';
import { ContractSetSettingMessage } from 'src/loot-hoarder-contract/client-actions/contract-set-setting-message';
import { WebSocketService } from '../../web-socket/web-socket.service';
import { Game } from '../client-representation/game';
import { UIStateManager } from '../ui-state-manager';

@Component({
  selector: 'app-game-tab-settings',
  templateUrl: './game-tab-settings.component.html',
  styleUrls: ['./game-tab-settings.component.scss']
})
export class GameTabSettingsComponent {
  public constructor (
    private readonly webSocketService: WebSocketService,
    private readonly uiStateManager: UIStateManager
  ) {

  }

  public get game(): Game { return this.uiStateManager.state.game; }
  public get automaticallyGoToNextCombat(): boolean { return this.game.settings.automaticallyGoToNextCombat; }
  public set automaticallyGoToNextCombat(newValue: boolean) {
    this.game.settings.automaticallyGoToNextCombat = newValue;
    this.setSetting(ContractGameSettingType.automaticallyGoToNextCombat, newValue);
  }
  public get alwaysShowChat(): boolean { return this.game.settings.alwaysShowChat; }
  public set alwaysShowChat(newValue: boolean) {
    this.game.settings.alwaysShowChat = newValue;
    this.setSetting(ContractGameSettingType.alwaysShowChat, newValue);
  }

  private setSetting(settingType: ContractGameSettingType, settingValue: any): void {
    this.webSocketService.send(new ContractSetSettingMessage(settingType, settingValue));
  }
}
