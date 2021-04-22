import { Subject } from 'rxjs';
import { DbCombatCharacter } from 'src/raw-game-state/db-combat-character';
import { UICombatCharacter } from 'src/ui-game-state/ui-combat-character';
import { AttributeSet } from '../attribute-set';
import { Ability } from './ability';

export class CombatCharacter {
  public dbModel: DbCombatCharacter;

  public attributes: AttributeSet;
  public abilities: Ability[];
  public abilityBeingUsed?: Ability;
  public onCurrentHealthChanged: Subject<number>;
  
  private _targetOfAbilityBeingUsed?: CombatCharacter;

  private constructor(
    dbModel: DbCombatCharacter,
    attributes: AttributeSet,
    abilities: Ability[]
  ) {
    this.dbModel = dbModel;
    this.attributes = attributes;
    this.abilities = abilities;
    if (dbModel.idOfAbilityBeingUsed) {
      this.abilityBeingUsed = abilities.find(a => a.id === dbModel.idOfAbilityBeingUsed);
    }
    this.onCurrentHealthChanged = new Subject();
  }

  public get id(): number { return this.dbModel.id; }
  public get name(): string { return this.dbModel.name; }
  public get currentHealth(): number { return this.dbModel.currentHealth; }
  public set currentHealth(value: number) { 
    if (value < 0) {
      value = 0;
    }
    if (value > this.attributes.maximumHealthVC.value) {
      value = this.attributes.maximumHealthVC.value;
    }
    if (this.dbModel.currentHealth !== value) {
      this.dbModel.currentHealth = value;
      this.onCurrentHealthChanged.next(value);
    }
  }
  public get isAlive(): boolean { return this.currentHealth > 0; }
  public get isDead(): boolean { return !this.isAlive; }
  public get remainingTimeToUseAbility(): number { return this.dbModel.remainingTimeToUseAbility; }
  public set remainingTimeToUseAbility(newValue: number) { this.dbModel.remainingTimeToUseAbility = newValue; }
  public get isUsingAbility(): boolean { return !!this.abilityBeingUsed; }

  public get targetOfAbilityBeingUsed(): CombatCharacter | undefined { return this._targetOfAbilityBeingUsed; }
  public set targetOfAbilityBeingUsed(target: CombatCharacter | undefined) {
    this.dbModel.idOfTargetOfAbilityBeingUsed = target ? target.id : undefined;
    this._targetOfAbilityBeingUsed = target;
  }

  public getUIState(): UICombatCharacter {
    return {
      id: this.dbModel.id,
      typeKey: this.dbModel.typeKey,
      currentHealth: this.dbModel.currentHealth,
      name: this.dbModel.name,
      controllingUserId: this.dbModel.controllingUserId
    };
  }

  public static load(dbModel: DbCombatCharacter): CombatCharacter {
    const attributes = AttributeSet.load(dbModel.attributeSet);
    const abilities = dbModel.abilities.map(dbAbility => Ability.load(dbAbility));
    const combatCharacter = new CombatCharacter(dbModel, attributes, abilities);
    return combatCharacter;
  }
}
