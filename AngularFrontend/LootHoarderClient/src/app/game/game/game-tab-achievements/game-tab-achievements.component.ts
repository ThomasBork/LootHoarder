import { Component } from '@angular/core';
import { Game } from '../client-representation/game';
import { UIStateManager } from '../ui-state-manager';

@Component({
  selector: 'app-game-tab-achievements',
  templateUrl: './game-tab-achievements.component.html',
  styleUrls: ['./game-tab-achievements.component.scss']
})
export class GameTabAchievementsComponent {
  public constructor (
    private readonly uiStateManager: UIStateManager
  ) {

  }
  
  public get game(): Game { return this.uiStateManager.state.game; }
}
