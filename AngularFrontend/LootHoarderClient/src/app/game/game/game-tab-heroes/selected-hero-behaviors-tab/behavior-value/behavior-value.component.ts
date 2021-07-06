import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ContractAttributeType } from 'src/loot-hoarder-contract/contract-attribute-type';
import { AssetManagerService } from '../../../client-representation/asset-manager.service';
import { CharacterBehaviorValue } from '../../../client-representation/character-behavior/character-behavior-value';
import { CharacterBehaviorValueAttribute } from '../../../client-representation/character-behavior/character-behavior-value-attribute';
import { CharacterBehaviorValueCurrentHealth } from '../../../client-representation/character-behavior/character-behavior-value-current-health';
import { CharacterBehaviorValueCurrentMana } from '../../../client-representation/character-behavior/character-behavior-value-current-mana';
import { CharacterBehaviorValueNumber } from '../../../client-representation/character-behavior/character-behavior-value-number';
import { CharacterBehaviorValuePercentageCurrentHealth } from '../../../client-representation/character-behavior/character-behavior-value-percentage-current-health';
import { CharacterBehaviorValuePercentageCurrentMana } from '../../../client-representation/character-behavior/character-behavior-value-percentage-current-mana';
import { CharacterBehaviorValueRemainingCooldownOfAbility } from '../../../client-representation/character-behavior/character-behavior-value-remaining-cooldown-of-ability';
import { Hero } from '../../../client-representation/hero';
import { UIStateManager } from '../../../ui-state-manager';

@Component({
  selector: 'app-behavior-value',
  templateUrl: './behavior-value.component.html',
  styleUrls: ['./behavior-value.component.scss']
})
export class BehaviorValueComponent {
  @Input()
  public value?: CharacterBehaviorValue | undefined;

  @Input()
  public hero?: Hero;

  @Output()
  public valueChange: EventEmitter<CharacterBehaviorValue | undefined>;

  public constructor(
    private readonly assetManagerService: AssetManagerService,
    private readonly uiStateManager: UIStateManager,
  ) {
    this.valueChange = new EventEmitter();
  }

  public get valueAsNumber(): CharacterBehaviorValueNumber | undefined {
    if (this.value instanceof CharacterBehaviorValueNumber) {
      return this.value;
    }
    return undefined;
  }

  public get valueAsCurrentHealth(): CharacterBehaviorValueCurrentHealth | undefined {
    if (this.value instanceof CharacterBehaviorValueCurrentHealth) {
      return this.value;
    }
    return undefined;
  }

  public get valueAsCurrentMana(): CharacterBehaviorValueCurrentMana | undefined {
    if (this.value instanceof CharacterBehaviorValueCurrentMana) {
      return this.value;
    }
    return undefined;
  }

  public get valueAsPercentageCurrentHealth(): CharacterBehaviorValuePercentageCurrentHealth | undefined {
    if (this.value instanceof CharacterBehaviorValuePercentageCurrentHealth) {
      return this.value;
    }
    return undefined;
  }

  public get valueAsPercentageCurrentMana(): CharacterBehaviorValuePercentageCurrentMana | undefined {
    if (this.value instanceof CharacterBehaviorValuePercentageCurrentMana) {
      return this.value;
    }
    return undefined;
  }

  public get valueAsRemainingCooldownOfAbility(): CharacterBehaviorValueRemainingCooldownOfAbility | undefined {
    if (this.value instanceof CharacterBehaviorValueRemainingCooldownOfAbility) {
      return this.value;
    }
    return undefined;
  }

  public get valueAsAttribute(): CharacterBehaviorValueAttribute | undefined {
    if (this.value instanceof CharacterBehaviorValueAttribute) {
      return this.value;
    }
    return undefined;
  }

  public selectValueNumber(): void {
    const newValue = new CharacterBehaviorValueNumber(0);
    this.setValue(newValue);
  }

  public selectValueCurrentHealth(): void {
    const newValue = new CharacterBehaviorValueCurrentHealth();
    this.setValue(newValue);
  }

  public selectValueCurrentMana(): void {
    const newValue = new CharacterBehaviorValueCurrentMana();
    this.setValue(newValue);
  }

  public selectValuePercentageCurrentHealth(): void {
    const newValue = new CharacterBehaviorValuePercentageCurrentHealth();
    this.setValue(newValue);
  }

  public selectValuePercentageCurrentMana(): void {
    const newValue = new CharacterBehaviorValuePercentageCurrentMana();
    this.setValue(newValue);
  }

  public selectValueRemainingCooldownOfAbility(): void {
    if (!this.hero) {
      throw Error (`Cannot use remaining cooldown of ability outside of a hero context`);
    }
    const ability = this.hero.abilities[0];
    const newValue = new CharacterBehaviorValueRemainingCooldownOfAbility(ability);
    this.setValue(newValue);
  }

  public selectValueAttribute(): void {
    const newValue = new CharacterBehaviorValueAttribute(ContractAttributeType.resistance, ['physical']);
    this.setValue(newValue);
  }

  private setValue(value: CharacterBehaviorValue | undefined): void {
    this.value = value;
    this.valueChange.emit(value);
  }
}
