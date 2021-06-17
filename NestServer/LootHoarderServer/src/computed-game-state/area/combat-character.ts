import { Subject } from 'rxjs';
import { ContractAttributeType } from 'src/loot-hoarder-contract/contract-attribute-type';
import { ContractCombatCharacter } from 'src/loot-hoarder-contract/contract-combat-character';
import { ContractPassiveAbilityTypeKey } from 'src/loot-hoarder-contract/contract-passive-ability-type-key';
import { DbCombatCharacter } from 'src/raw-game-state/db-combat-character';
import { AttributeSet } from '../attribute-set';
import { EventStream } from '../event-stream';
import { PassiveAbility } from '../passive-ability';
import { PassiveAbilityParametersAttribute } from '../passive-ability-parameters-attribute';
import { PassiveAbilityTakeDamageOverTime } from '../passive-ability-take-damage-over-time';
import { ValueContainer } from '../value-container';
import { CombatCharacterAbility } from './combat-character-ability';
import { ContinuousEffect } from './continuous-effect';

export class CombatCharacter {
  public dbModel: DbCombatCharacter;

  public attributes: AttributeSet;
  public abilities: CombatCharacterAbility[];
  public abilityBeingUsed?: CombatCharacterAbility;
  public continuousEffects: ContinuousEffect[];

  public onDeath: EventStream<void>;
  public onCurrentHealthChanged: EventStream<number>;
  public onCurrentManaChanged: EventStream<number>;
  public onContinuousEffectAdded: EventStream<ContinuousEffect>;
  public onContinuousEffectRemoved: EventStream<ContinuousEffect>;
  public maximumHealthVC: ValueContainer;
  public maximumManaVC: ValueContainer;
  
  private _targetOfAbilityBeingUsed?: CombatCharacter;

  private constructor(
    dbModel: DbCombatCharacter,
    attributes: AttributeSet,
    abilities: CombatCharacterAbility[],
    continuousEffects: ContinuousEffect[]
  ) {
    this.dbModel = dbModel;
    this.attributes = attributes;
    this.abilities = abilities;
    this.continuousEffects = continuousEffects;

    if (dbModel.idOfAbilityBeingUsed) {
      this.abilityBeingUsed = abilities.find(a => a.id === dbModel.idOfAbilityBeingUsed);
    }
    
    this.onDeath = new EventStream();
    this.onCurrentHealthChanged = new EventStream();
    this.onCurrentManaChanged = new EventStream();
    this.onContinuousEffectAdded = new EventStream();
    this.onContinuousEffectRemoved = new EventStream();

    this.setUpAbilityValueContainers();
    this.maximumHealthVC = this.attributes.getAttribute(ContractAttributeType.maximumHealth, []).valueContainer;
    this.maximumManaVC = this.attributes.getAttribute(ContractAttributeType.maximumMana, []).valueContainer;

    this.continuousEffects.forEach(continuousEffect => this.applyPassiveAbilityEffects(continuousEffect.abilities))
  }

  public get id(): number { return this.dbModel.id; }
  public get name(): string { return this.dbModel.name; }
  public get currentHealth(): number { return this.dbModel.currentHealth; }
  public get currentMana(): number { return this.dbModel.currentMana; }
  public get isAlive(): boolean { return this.currentHealth > 0; }
  public get isDead(): boolean { return !this.isAlive; }
  public get remainingTimeToUseAbility(): number { return this.dbModel.remainingTimeToUseAbility; }
  public set remainingTimeToUseAbility(newValue: number) { this.dbModel.remainingTimeToUseAbility = newValue; }
  public get totalTimeToUseAbility(): number | undefined { return this.dbModel.totalTimeToUseAbility; }
  public set totalTimeToUseAbility(newValue: number | undefined) { this.dbModel.totalTimeToUseAbility = newValue; }
  public get isUsingAbility(): boolean { return !!this.abilityBeingUsed; }

  public get targetOfAbilityBeingUsed(): CombatCharacter | undefined { return this._targetOfAbilityBeingUsed; }
  public set targetOfAbilityBeingUsed(target: CombatCharacter | undefined) {
    this.dbModel.idOfTargetOfAbilityBeingUsed = target ? target.id : undefined;
    this._targetOfAbilityBeingUsed = target;
  }

  public setCurrentHealth(value: number, shouldSendChangeEvent: boolean = true) {
    if (value < 0) {
      value = 0;
    }
    if (value > this.maximumHealthVC.value) {
      value = this.maximumHealthVC.value;
    }
    if (this.dbModel.currentHealth !== value) {
      this.dbModel.currentHealth = value;
      if (shouldSendChangeEvent) {
        this.onCurrentHealthChanged.next(value);
      }
      if (this.dbModel.currentHealth === 0) {
        this.onDeath.next();
      }
    }
  }

  public setCurrentMana(value: number, shouldSendChangeEvent: boolean = true) {
    if (value < 0) {
      value = 0;
    }
    if (value > this.maximumManaVC.value) {
      value = this.maximumManaVC.value;
    }
    if (this.dbModel.currentMana !== value) {
      this.dbModel.currentMana = value;
      if (shouldSendChangeEvent) {
        this.onCurrentManaChanged.next(value);
      }
    }
  }

  public addContinuousEffect(continuousEffect: ContinuousEffect): void {
    if (continuousEffect.type.isUnique) {
      this.continuousEffects
        .filter(c => c.type === continuousEffect.type)
        .forEach(c => this.removeContinuousEffect(c));
    }
    this.continuousEffects.push(continuousEffect);
    this.applyPassiveAbilityEffects(continuousEffect.abilities);
    this.onContinuousEffectAdded.next(continuousEffect);
  }

  public removeContinuousEffect(continuousEffect: ContinuousEffect): void {
    const index = this.continuousEffects.indexOf(continuousEffect);
    if (index < 0) {
      throw Error ('Continuous effect does not exist on character.');
    }
    this.continuousEffects.splice(index, 1);
    this.removePassiveAbilityEffects(continuousEffect.abilities);
    this.onContinuousEffectRemoved.next(continuousEffect);
  }

  public toContractModel(): ContractCombatCharacter {
    return {
      id: this.dbModel.id,
      typeKey: this.dbModel.typeKey,
      currentHealth: this.dbModel.currentHealth,
      currentMana: this.dbModel.currentMana,
      name: this.dbModel.name,
      controllingUserId: this.dbModel.controllingUserId,
      attributes: this.attributes.toContractModel(),
      abilities: this.abilities.map(ability => ability.getUIState()),
      remainingTimeToUseAbility: this.remainingTimeToUseAbility,
      totalTimeToUseAbility: this.totalTimeToUseAbility,
      idOfAbilityBeingUsed: this.dbModel.idOfAbilityBeingUsed,
      idOfTargetOfAbilityBeingUsed: this.dbModel.idOfTargetOfAbilityBeingUsed,
      continuousEffects: this.continuousEffects.map(continuousEffect => continuousEffect.toContractModel())
    };
  }

  private setUpAbilityValueContainers(): void {
    for(const ability of this.abilities) {
      for(const effect of ability.effects) {
        this.setUpAbilityValueContainer(effect.typeEffect.tags, effect.powerVC, ContractAttributeType.power);
      }
      this.setUpAbilityValueContainer(ability.type.tags, ability.useSpeedVC, ContractAttributeType.useSpeed);
      this.setUpAbilityValueContainer(ability.type.tags, ability.cooldownSpeedVC, ContractAttributeType.cooldownSpeed);
    }
  }

  private setUpAbilityValueContainer(tags: string[], valueContainer: ValueContainer, attributeType: ContractAttributeType): void {
    const combinedAttribute = this.attributes.getAttribute(attributeType, tags);
    valueContainer.setAdditiveValueContainer(combinedAttribute.accumulatedAdditiveValueContainer);
    valueContainer.setMultiplicativeValueContainer(combinedAttribute.accumulatedMultiplicativeValueContainer);
  }

  private applyPassiveAbilityEffects(abilities: PassiveAbility[]): void {
    for(const ability of abilities) {
      switch(ability.type.key) {
        case 'attribute': {
          if (!(ability.parameters instanceof PassiveAbilityParametersAttribute)) {
            throw Error ('Expected attribute ability to have attribute ability parameters.');
          }
          const isAdditive = ability.parameters.isAdditive;
          const attributeType = ability.parameters.attributeType;
          const abilityTags = ability.parameters.abilityTags;
          const amount = ability.parameters.amount;
          const attribute = this.attributes.getAttribute(attributeType, abilityTags);
          if (isAdditive){ 
            const attributeValueContainer = attribute.additiveValueContainer;
            attributeValueContainer.setAdditiveModifier(ability, amount);
          } else {
            const attributeValueContainer = attribute.multiplicativeValueContainer;
            attributeValueContainer.setMultiplicativeModifier(ability, amount);
          }
        }
        break;
        case ContractPassiveAbilityTypeKey.takeDamageOverTime: {
          if (!(ability instanceof PassiveAbilityTakeDamageOverTime)) {
            throw Error (`The ability with type key ${ability.type.key} must be an instance of PassiveAbilityTakeDamageOverTime`);
          }

          const combinedResistanceAttribute = this.attributes.getAttribute(ContractAttributeType.resistance, ability.parameters.abilityTags);
          ability.damageTakenEverySecondVC.setMultiplicativeValueContainer(combinedResistanceAttribute.valueContainer, value => 100 / ( 100 + value));
        }
        break;
        default: throw Error (`Unhandled ability type for combat character: ${ability.type.key}`);
      }
    }
  }

  private removePassiveAbilityEffects(abilities: PassiveAbility[]): void {
    for(const ability of abilities) {
      switch(ability.type.key) {
        case 'attribute': {
          if (!(ability.parameters instanceof PassiveAbilityParametersAttribute)) {
            throw Error ('Expected attribute ability to have attribute ability parameters.');
          }
          const attribute = this.attributes.getAttribute(ability.parameters.attributeType, ability.parameters.abilityTags);
          const attributeValueContainer = ability.parameters.isAdditive ? attribute.additiveValueContainer : attribute.multiplicativeValueContainer;
          attributeValueContainer.removeModifiers(ability);
        }
        break;
        case ContractPassiveAbilityTypeKey.takeDamageOverTime: {
          // This has no immediate effect. It is applied every tick.
        }
        break;
        default: throw Error (`Unhandled ability type for combat character: ${ability.type.key}`);
      }
    }
  }

  public static load(dbModel: DbCombatCharacter): CombatCharacter {
    const attributes = AttributeSet.load(dbModel.attributeSet);
    const abilities = dbModel.abilities.map(dbAbility => CombatCharacterAbility.load(dbAbility));
    const continuousEffects = dbModel.continuousEffects.map(dbContinuousEffect => ContinuousEffect.load(dbContinuousEffect));
    const combatCharacter = new CombatCharacter(dbModel, attributes, abilities, continuousEffects);
    return combatCharacter;
  }
}
