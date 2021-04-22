import { Injectable } from "@angular/core";
import { ContractArea } from "src/loot-hoarder-contract/contract-area";
import { ContractAreaHero } from "src/loot-hoarder-contract/contract-area-hero";
import { ContractCombat } from "src/loot-hoarder-contract/contract-combat";
import { ContractCombatCharacter } from "src/loot-hoarder-contract/contract-combat-character";
import { ContractGame } from "src/loot-hoarder-contract/contract-game";
import { ContractHero } from "src/loot-hoarder-contract/contract-hero";
import { ContractLoot } from "src/loot-hoarder-contract/contract-loot";
import { Area } from "./client-representation/area";
import { AreaHero } from "./client-representation/area-hero";
import { Combat } from "./client-representation/combat";
import { CombatCharacter } from "./client-representation/combat-character";
import { Game } from "./client-representation/game";
import { Hero } from "./client-representation/hero";
import { Loot } from "./client-representation/loot";
import { AssetManagerService } from "./client-representation/asset-manager.service";

@Injectable()
export class GameStateMapper {
  public constructor(
    private readonly assetManagerService: AssetManagerService
  ) {}

  public mapToGame(serverGame: ContractGame): Game {
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

  public mapToHero(serverHero: ContractHero): Hero {
    const heroType = this.assetManagerService.getHeroType(serverHero.typeKey);
    return new Hero (
      serverHero.id,
      heroType,
      serverHero.name,
      serverHero.level,
      serverHero.experience
    );
  }

  public mapToArea(serverArea: ContractArea): Area {
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

  public mapToCombat(serverCombat: ContractCombat): Combat {
    const team1 = serverCombat.team1.map(cc => this.mapToCombatCharacter(cc));
    const team2 = serverCombat.team2.map(cc => this.mapToCombatCharacter(cc));
    return new Combat(
      serverCombat.id,
      team1,
      team2
    );
  }

  public mapToAreaHero(serverAreaHero: ContractAreaHero, combatCharacter: CombatCharacter): AreaHero {
    const loot = this.mapToLoot(serverAreaHero.loot);
    return new AreaHero(
      serverAreaHero.gameId,
      serverAreaHero.heroId,
      loot,
      combatCharacter
    );
  }

  public mapToCombatCharacter(serverCombatCharacter: ContractCombatCharacter): CombatCharacter {
    return new CombatCharacter(
      serverCombatCharacter.id,
      serverCombatCharacter.controllingUserId,
      serverCombatCharacter.name,
      serverCombatCharacter.currentHealth
    );
  }

  public mapToLoot(serverLoot: ContractLoot): Loot {
    return new Loot(
      serverLoot.items,
      serverLoot.gold
    );
  }
}
