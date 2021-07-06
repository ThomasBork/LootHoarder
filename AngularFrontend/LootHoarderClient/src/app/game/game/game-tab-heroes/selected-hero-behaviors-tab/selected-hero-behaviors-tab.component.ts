import { Component, Input } from '@angular/core';
import { WebSocketService } from 'src/app/game/web-socket/web-socket.service';
import { ContractCreateHeroBehaviorMessage } from 'src/loot-hoarder-contract/client-actions/contract-create-hero-behavior-message';
import { ContractSetCurrentHeroBehaviorMessage } from 'src/loot-hoarder-contract/client-actions/contract-set-current-hero-behavior-message';
import { CharacterBehavior } from '../../client-representation/character-behavior/character-behavior';
import { CharacterBehaviorAction } from '../../client-representation/character-behavior/character-behavior-action';
import { CharacterBehaviorTarget } from '../../client-representation/character-behavior/character-behavior-target';
import { CharacterBehaviorTargetRandomCharacter } from '../../client-representation/character-behavior/character-behavior-target-random-character';
import { Hero } from '../../client-representation/hero';
import { HeroAbility } from '../../client-representation/hero-ability';
import { UIStateManager } from '../../ui-state-manager';

@Component({
  selector: 'app-selected-hero-behaviors-tab',
  templateUrl: './selected-hero-behaviors-tab.component.html',
  styleUrls: ['./selected-hero-behaviors-tab.component.scss']
})
export class SelectedHeroBehaviorsTabComponent {
  @Input()
  public hero!: Hero;

  public constructor(
    private readonly uiStateManager: UIStateManager,
    private readonly webSocketService: WebSocketService
  ) { }

  public get behaviors(): CharacterBehavior[] { return this.hero.behaviors; }
  public get selectedBehavior(): CharacterBehavior | undefined { return this.uiStateManager.state.heroesTab.behaviorsTab.selectedBehavior; }
  public get currentBehavior(): CharacterBehavior | undefined { return this.hero.currentBehavior; }

  public createBehavior(): void {
    const message = new ContractCreateHeroBehaviorMessage(this.hero.id);
    this.webSocketService.send(message);
  }

  public handleBehaviorCheckBoxCheckedChange(behavior: CharacterBehavior, newCheckedValue: boolean): void {
    if (newCheckedValue) {
      this.setCurrentBehavior(behavior);
    } else {
      this.setCurrentBehavior(undefined);
    }
  }

  public setCurrentBehavior(behavior: CharacterBehavior | undefined): void {
    const message = new ContractSetCurrentHeroBehaviorMessage(this.hero.id, behavior?.id);
    this.webSocketService.send(message);
  }

  public selectBehavior(behavior: CharacterBehavior): void {
    this.uiStateManager.state.heroesTab.behaviorsTab.selectedBehavior = behavior;
  }

  public addAction(behavior: CharacterBehavior, ability: HeroAbility): void {
    const target = new CharacterBehaviorTargetRandomCharacter(false, true);
    const action = new CharacterBehaviorAction(undefined, ability, target);
    behavior.addAction(action);
  }

  public stopEventPropagation(mouseEvent: MouseEvent): void {
    mouseEvent.stopPropagation();
  }
}
