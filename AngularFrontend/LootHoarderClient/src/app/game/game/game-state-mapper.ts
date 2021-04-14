import { Injectable } from "@angular/core";
import { Area } from "./client-representation/area";
import { AreaHero } from "./client-representation/area-hero";
import { Combat } from "./client-representation/combat";
import { CombatCharacter } from "./client-representation/combat-character";
import { Game } from "./client-representation/game";
import { Hero } from "./client-representation/hero";
import { Loot } from "./client-representation/loot";
import { ServerArea } from "./server-representation/server-area";
import { ServerAreaHero } from "./server-representation/server-area-hero";
import { ServerCombat } from "./server-representation/server-combat";
import { ServerCombatCharacter } from "./server-representation/server-combat-character";
import { ServerGame } from "./server-representation/server-game";
import { ServerHero } from "./server-representation/server-hero";
import { ServerLoot } from "./server-representation/server-loot";
import { AssetManagerService } from "./static-game-content/asset-manager.service";

@Injectable()
export class GameStateMapper {
  public constructor(
    private readonly assetManagerService: AssetManagerService
  ) {}

  public mapToGame(serverGame: ServerGame): Game {
    const heroes = serverGame.heroes.map(hero => this.mapToHero(hero));
    const areas = serverGame.areas.map(area => this.mapToArea(area));
    const completedAreaTypes = serverGame.completedAreaTypeKeys.map(key => this.assetManagerService.getAreaType(key));
    const availableAreaTypes = serverGame.availableAreaTypeKeys.map(key => this.assetManagerService.getAreaType(key));

    return new Game(
      serverGame.id,
      serverGame.createdAt,
      heroes,
      areas,
      completedAreaTypes,
      availableAreaTypes
    );
  }

  public mapToHero(serverHero: ServerHero): Hero {
    const heroType = this.assetManagerService.getHeroType(serverHero.typeKey);
    return new Hero (
      serverHero.id,
      heroType,
      serverHero.name,
      serverHero.level,
      serverHero.experience
    );
  }

  public mapToArea(serverArea: ServerArea): Area {
    const areaType = this.assetManagerService.getAreaType(serverArea.typeKey);
    const currentCombat = this.mapToCombat(serverArea.currentCombat);
    const areaHeroes = serverArea.heroes.map(areaHero => { 
      const combatCharacter = currentCombat.team1
        .concat(currentCombat.team2)
        .find(cc => cc.id === areaHero.combatCharacterId);
      if (!combatCharacter) {
        throw Error(`Combat character is not in this area.`);
      }
      return this.mapToAreaHero(areaHero, combatCharacter);
    });

    return new Area (
      serverArea.id,
      areaType,
      areaHeroes,
      currentCombat,
      serverArea.totalAmountOfCombats,
      serverArea.currentCombatNumber
    );
  }

  public mapToCombat(serverCombat: ServerCombat): Combat {
    const team1 = serverCombat.team1.map(cc => this.mapToCombatCharacter(cc));
    const team2 = serverCombat.team2.map(cc => this.mapToCombatCharacter(cc));
    return new Combat(
      serverCombat.id,
      team1,
      team2
    );
  }

  public mapToAreaHero(serverAreaHero: ServerAreaHero, combatCharacter: CombatCharacter): AreaHero {
    const loot = this.mapToLoot(serverAreaHero.loot);
    return new AreaHero(
      serverAreaHero.gameId,
      serverAreaHero.heroId,
      loot,
      combatCharacter
    );
  }

  public mapToCombatCharacter(serverCombatCharacter: ServerCombatCharacter): CombatCharacter {
    return new CombatCharacter(
      serverCombatCharacter.id,
      serverCombatCharacter.controllingUserId,
      serverCombatCharacter.name,
      serverCombatCharacter.currentHealth
    );
  }

  public mapToLoot(serverLoot: ServerLoot): Loot {
    return new Loot(
      serverLoot.items,
      serverLoot.gold
    );
  }
}
