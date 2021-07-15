import { Injectable } from "@angular/core";
import { PassiveAbilityTakeDamageOverTime } from "./client-representation/passive-ability-take-damage-over-time";
import { UIState } from "./client-representation/ui-state";

@Injectable()
export class UIStateAdvancer {
  private readonly tickSize = 10;
  private uiState?: UIState;
  private updateTimeout?: number;
  private lastUpdate?: number;

  public beginUpdating(uiState: UIState): void {
    this.uiState = uiState;
    this.lastUpdate = new Date().getTime();
    this.updateTimeout = window.setTimeout(() => this.catchUp(), this.tickSize);
  }

  public stopUpdating(): void {
    window.clearTimeout(this.updateTimeout);
  }

  private catchUp(): void {
    if (!this.lastUpdate) {
      throw Error ('Cannot catch up from an unknown timestamp.');
    }

    const now = new Date().getTime();

    let timeToCatchUp = now - this.lastUpdate;

    while (timeToCatchUp > this.tickSize) {
      this.update(this.tickSize);
      timeToCatchUp -= this.tickSize;
    }

    this.lastUpdate = now - timeToCatchUp;

    this.updateTimeout = window.setTimeout(() => this.catchUp(), this.tickSize);
  }

  private update(tickSize: number): void {
    if (!this.uiState) {
      throw Error (`Cannot update an unknown game state.`);
    }
    for(const area of this.uiState.game.areas) {
      const combat = area.currentCombat;
      if (combat.hasEnded) {
        continue;
      }
      
      const allCharacters = combat.getAllCharacters();
      for (const character of allCharacters) {
        if (!character.isAlive) {
          continue;
        }

        for (const continuousEffect of character.continuousEffects) {
          for(const continuousEffectAbility of continuousEffect.abilities) {
            if (continuousEffectAbility instanceof PassiveAbilityTakeDamageOverTime) {
              const damageTakenThisTick = continuousEffectAbility.damageTakenEverySecond * tickSize / 1000;
              character.currentHealth -= damageTakenThisTick;
            }
          }
        }
      }
      for (const character of allCharacters) {
        if (!character.isAlive) {
          continue;
        }

        if (character.remainingTimeToUseAbility > 0) {
          if (character.abilityBeingUsed?.type.key === 'lightning-bolt') {
            var a = 1;
          }
          character.remainingTimeToUseAbility -= tickSize;
          if (character.remainingTimeToUseAbility < 0) {
            character.remainingTimeToUseAbility = 0;
          }
        }

        for(const ability of character.abilities) {
          if (ability.remainingCooldown > 0) {
            ability.remainingCooldown -= tickSize;
            if (ability.remainingCooldown < 0) {
              ability.remainingCooldown = 0;
            }
          }
        }
      }
    }
  }
}