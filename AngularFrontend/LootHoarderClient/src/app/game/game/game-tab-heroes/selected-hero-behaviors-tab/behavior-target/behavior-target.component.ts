import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AssetManagerService } from '../../../asset-manager.service';
import { CharacterBehaviorPredicateHasContinuousEffect } from '../../../client-representation/character-behavior/character-behavior-predicate-has-continuous-effect';
import { CharacterBehaviorTarget } from '../../../client-representation/character-behavior/character-behavior-target';
import { CharacterBehaviorTargetCharacterWithExtremeValue } from '../../../client-representation/character-behavior/character-behavior-target-character-with-extreme-value';
import { CharacterBehaviorTargetRandomCharacter } from '../../../client-representation/character-behavior/character-behavior-target-random-character';
import { CharacterBehaviorTargetRandomCharacterMatchingPredicate } from '../../../client-representation/character-behavior/character-behavior-target-random-character-matching-predicate';
import { CharacterBehaviorTargetSpecificHero } from '../../../client-representation/character-behavior/character-behavior-target-specific-hero';
import { CharacterBehaviorValueCurrentHealth } from '../../../client-representation/character-behavior/character-behavior-value-current-health';
import { UIStateManager } from '../../../ui-state-manager';

@Component({
  selector: 'app-behavior-target',
  templateUrl: './behavior-target.component.html',
  styleUrls: ['./behavior-target.component.scss']
})
export class BehaviorTargetComponent {
  @Input()
  public target?: CharacterBehaviorTarget | undefined;

  @Output()
  public targetChange: EventEmitter<CharacterBehaviorTarget | undefined>;

  public constructor(
    private readonly assetManagerService: AssetManagerService,
    private readonly uiStateManager: UIStateManager,
  ) {
    this.targetChange = new EventEmitter();
  }

  public get targetAsRandomCharacter(): CharacterBehaviorTargetRandomCharacter | undefined {
    if (this.target instanceof CharacterBehaviorTargetRandomCharacter) {
      return this.target;
    }
    return undefined;
  }

  public get targetAsRandomCharacterMatchingPredicate(): CharacterBehaviorTargetRandomCharacterMatchingPredicate | undefined {
    if (this.target instanceof CharacterBehaviorTargetRandomCharacterMatchingPredicate) {
      return this.target;
    }
    return undefined;
  }

  public get targetAsSpecificHero(): CharacterBehaviorTargetSpecificHero | undefined {
    if (this.target instanceof CharacterBehaviorTargetSpecificHero) {
      return this.target;
    }
    return undefined;
  }

  public get targetAsCharacterWithExtremeValue(): CharacterBehaviorTargetCharacterWithExtremeValue | undefined {
    if (this.target instanceof CharacterBehaviorTargetCharacterWithExtremeValue) {
      return this.target;
    }
    return undefined;
  }

  public selectTargetNoTarget(): void {
    this.setTarget(undefined);
  }

  public selectTargetRandomAlly(): void {
    const newTarget = new CharacterBehaviorTargetRandomCharacter(true, false);
    this.setTarget(newTarget);
  }

  public selectTargetRandomEnemy(): void {
    const newTarget = new CharacterBehaviorTargetRandomCharacter(false, true);
    this.setTarget(newTarget);
  }

  public selectTargetRandomCharacter(): void {
    const newTarget = new CharacterBehaviorTargetRandomCharacter(true, true);
    this.setTarget(newTarget);
  }

  public selectTargetRandomAllyMatchingPredicate(): void {
    const poisoned = this.assetManagerService.getContinuousEffectType('poisoned');
    const predicate = new CharacterBehaviorPredicateHasContinuousEffect(poisoned);
    const newTarget = new CharacterBehaviorTargetRandomCharacterMatchingPredicate(true, false, predicate);
    this.setTarget(newTarget);
  }

  public selectTargetRandomEnemyMatchingPredicate(): void {
    const poisoned = this.assetManagerService.getContinuousEffectType('poisoned');
    const predicate = new CharacterBehaviorPredicateHasContinuousEffect(poisoned);
    const newTarget = new CharacterBehaviorTargetRandomCharacterMatchingPredicate(false, true, predicate);
    this.setTarget(newTarget);
  }

  public selectTargetRandomCharacterMatchingPredicate(): void {
    const poisoned = this.assetManagerService.getContinuousEffectType('poisoned');
    const predicate = new CharacterBehaviorPredicateHasContinuousEffect(poisoned);
    const newTarget = new CharacterBehaviorTargetRandomCharacterMatchingPredicate(true, true, predicate);
    this.setTarget(newTarget);
  }

  public selectTargetAllyWithExtremeValue(): void {
    const value = new CharacterBehaviorValueCurrentHealth();
    const newTarget = new CharacterBehaviorTargetCharacterWithExtremeValue(true, false, true, value);
    this.setTarget(newTarget);
  }

  public selectTargetEnemyWithExtremeValue(): void {
    const value = new CharacterBehaviorValueCurrentHealth();
    const newTarget = new CharacterBehaviorTargetCharacterWithExtremeValue(false, true, true, value);
    this.setTarget(newTarget);
  }

  public selectTargetCharacterWithExtremeValue(): void {
    const value = new CharacterBehaviorValueCurrentHealth();
    const newTarget = new CharacterBehaviorTargetCharacterWithExtremeValue(true, true, true, value);
    this.setTarget(newTarget);
  }

  public selectTargetSpecificHero(): void {
    const hero = this.uiStateManager.state.game.heroes[0];
    const newTarget = new CharacterBehaviorTargetSpecificHero(hero.id);
    this.setTarget(newTarget);
  }

  private setTarget(target: CharacterBehaviorTarget | undefined): void {
    this.target = target;
    this.targetChange.emit(target);
  }
}
