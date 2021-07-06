import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ContractCharacterBehaviorValueRelation } from 'src/loot-hoarder-contract/contract-character-behavior-value-relation';
import { AssetManagerService } from '../../../client-representation/asset-manager.service';
import { CharacterBehaviorPredicate } from '../../../client-representation/character-behavior/character-behavior-predicate';
import { CharacterBehaviorPredicateAbilityReady } from '../../../client-representation/character-behavior/character-behavior-predicate-ability-ready';
import { CharacterBehaviorPredicateAnd } from '../../../client-representation/character-behavior/character-behavior-predicate-and';
import { CharacterBehaviorPredicateHasContinuousEffect } from '../../../client-representation/character-behavior/character-behavior-predicate-has-continuous-effect';
import { CharacterBehaviorPredicateNot } from '../../../client-representation/character-behavior/character-behavior-predicate-not';
import { CharacterBehaviorPredicateOr } from '../../../client-representation/character-behavior/character-behavior-predicate-or';
import { CharacterBehaviorPredicateRelativeValues } from '../../../client-representation/character-behavior/character-behavior-predicate-relative-values';
import { CharacterBehaviorValueCurrentHealth } from '../../../client-representation/character-behavior/character-behavior-value-current-health';
import { CharacterBehaviorValueNumber } from '../../../client-representation/character-behavior/character-behavior-value-number';
import { Hero } from '../../../client-representation/hero';

@Component({
  selector: 'app-behavior-predicate',
  templateUrl: './behavior-predicate.component.html',
  styleUrls: ['./behavior-predicate.component.scss']
})
export class BehaviorPredicateComponent {
  @Input()
  public predicate?: CharacterBehaviorPredicate | undefined;

  @Input()
  public hero?: Hero;
  
  @Output()
  public predicateChange: EventEmitter<CharacterBehaviorPredicate | undefined>;

  public constructor(private readonly assetManagerService: AssetManagerService) {
    this.predicateChange = new EventEmitter();
  }

  public get predicateAsAbilityReady(): CharacterBehaviorPredicateAbilityReady | undefined {
    if (this.predicate instanceof CharacterBehaviorPredicateAbilityReady) {
      return this.predicate;
    }
    return undefined;
  }

  public get predicateAsHasContinuousEffect(): CharacterBehaviorPredicateHasContinuousEffect | undefined {
    if (this.predicate instanceof CharacterBehaviorPredicateHasContinuousEffect) {
      return this.predicate;
    }
    return undefined;
  }

  public get predicateAsAnd(): CharacterBehaviorPredicateAnd | undefined {
    if (this.predicate instanceof CharacterBehaviorPredicateAnd) {
      return this.predicate;
    }
    return undefined;
  }

  public get predicateAsNot(): CharacterBehaviorPredicateNot | undefined {
    if (this.predicate instanceof CharacterBehaviorPredicateNot) {
      return this.predicate;
    }
    return undefined;
  }

  public get predicateAsOr(): CharacterBehaviorPredicateOr | undefined {
    if (this.predicate instanceof CharacterBehaviorPredicateOr) {
      return this.predicate;
    }
    return undefined;
  }

  public get predicateAsRelativeValues(): CharacterBehaviorPredicateRelativeValues | undefined {
    if (this.predicate instanceof CharacterBehaviorPredicateRelativeValues) {
      return this.predicate;
    }
    return undefined;
  }

  public selectPredicateNoPredicate(): void {
    this.setPredicate(undefined);
  }

  public selectPredicateAbilityReady(): void {
    if (!this.hero) {
      throw Error (`Cannot use the ability ready predicate outside the context of a hero`);
    }

    const ability = this.hero.abilities[0];
    const predicate = new CharacterBehaviorPredicateAbilityReady(ability);
    this.setPredicate(predicate);
  }

  public selectPredicateHasContinuousEffect(): void {
    const predicate = this.buildHasContinuousEffectPredicate();
    this.setPredicate(predicate);
  }

  public selectPredicateAnd(): void {
    const innerPredicate1 = this.buildHasContinuousEffectPredicate();
    const innerPredicate2 = this.buildHasContinuousEffectPredicate();
    const innerPredicates = [innerPredicate1, innerPredicate2];
    const predicate = new CharacterBehaviorPredicateAnd(innerPredicates);
    this.setPredicate(predicate);
  }

  public selectPredicateOr(): void {
    const innerPredicate1 = this.buildHasContinuousEffectPredicate();
    const innerPredicate2 = this.buildHasContinuousEffectPredicate();
    const innerPredicates = [innerPredicate1, innerPredicate2];
    const predicate = new CharacterBehaviorPredicateOr(innerPredicates);
    this.setPredicate(predicate);
  }

  public selectPredicateNot(): void {
    const innerPredicate = this.buildHasContinuousEffectPredicate();
    const predicate = new CharacterBehaviorPredicateNot(innerPredicate);
    this.setPredicate(predicate);
  }

  public selectPredicateRelativeValues(): void {
    const leftValue = new CharacterBehaviorValueCurrentHealth();
    const rightValue = new CharacterBehaviorValueNumber(0);
    const valueRelation = ContractCharacterBehaviorValueRelation.greaterThan;
    const predicate = new CharacterBehaviorPredicateRelativeValues(leftValue, rightValue, valueRelation);
    this.setPredicate(predicate);
  }

  private buildHasContinuousEffectPredicate(): CharacterBehaviorPredicateHasContinuousEffect {
    const continuousEffectType = this.assetManagerService.getAllContinuousEffectTypes()[0];
    const predicate = new CharacterBehaviorPredicateHasContinuousEffect(continuousEffectType);
    return predicate;
  }

  private setPredicate(predicate: CharacterBehaviorPredicate | undefined): void {
    this.predicate = predicate;
    this.predicateChange.emit(predicate);
  }
}
