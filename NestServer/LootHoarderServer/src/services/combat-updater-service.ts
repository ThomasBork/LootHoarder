import { Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { EventBus } from "@nestjs/cqrs";
import { Combat } from "src/computed-game-state/area/combat";
import { Game } from "src/computed-game-state/game";
import { CombatCharacterCurrentHealthChanged } from "src/game-message-handlers/from-server/combat-character-current-health-changed";
import { GamesManager } from "./games-manager";

@Injectable()
export class CombatUpdaterService implements OnApplicationBootstrap {
  private readonly tickFrequencyInMilliseconds: number = 250;
  private a?: NodeJS.Timeout;

  public constructor(
    private readonly gamesManager: GamesManager,
    private readonly eventBus: EventBus
  ) {}

  public onApplicationBootstrap(): void {
    this.a = setInterval(() => this.updateCombats(), this.tickFrequencyInMilliseconds);
  }

  private updateCombats(): void {
    const games = this.gamesManager.getGames();
    for(const game of games) {
      for(const area of game.areas) {
        this.updateCombat(game, area.currentCombat);
      }
    }
  }

  private updateCombat(game: Game, combat: Combat): void {
    const tickFrequencyOverSecond = this.tickFrequencyInMilliseconds / 1000;
    for(const combatCharacter of combat.team1) {
      combatCharacter.currentHealth -= 3 * tickFrequencyOverSecond;
      this.eventBus.publish(new CombatCharacterCurrentHealthChanged(game, combat.id, combatCharacter, combatCharacter.currentHealth));
    }
    for(const combatCharacter of combat.team2) {
      combatCharacter.currentHealth -= 2 * tickFrequencyOverSecond;
      this.eventBus.publish(new CombatCharacterCurrentHealthChanged(game, combat.id, combatCharacter, combatCharacter.currentHealth));
    }
  }
}
