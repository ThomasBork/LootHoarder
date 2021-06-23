import { Component } from '@angular/core';
import { Game } from '../client-representation/game';
import { UIStateManager } from '../ui-state-manager';

@Component({
  selector: 'app-game-tab-quests',
  templateUrl: './game-tab-quests.component.html',
  styleUrls: ['./game-tab-quests.component.scss']
})
export class GameTabQuestsComponent {
  public constructor (
    private readonly uiStateManager: UIStateManager
  ) {

  }
  
  public get game(): Game { return this.uiStateManager.state.game; }
}