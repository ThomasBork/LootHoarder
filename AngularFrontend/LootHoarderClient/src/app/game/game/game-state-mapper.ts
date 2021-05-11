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
import { GameAreaType } from "./client-representation/game-area-type";
import { AreaType } from "./client-representation/area-type";
import { AttributeSet } from "./client-representation/attribute-set";
import { ContractCombatCharacterAbility } from "src/loot-hoarder-contract/contract-combat-character-ability";
import { CombatCharacterAbility } from "./client-representation/combat-character-ability";
import { ContractAttribute } from "src/loot-hoarder-contract/contract-attribute";
import { Attribute } from "./client-representation/attribute";
import { Item } from "./client-representation/item";
import { ItemAbility } from "./client-representation/item-ability";
import { ContractItem } from "src/loot-hoarder-contract/contract-item";
import { ContractInventory } from "src/loot-hoarder-contract/contract-inventory";
import { Inventory } from "./client-representation/inventory";
import { ContractItemAbility } from "src/loot-hoarder-contract/contract-item-ability";

@Injectable()
export class GameStateMapper {
  public constructor(
    private readonly assetManagerService: AssetManagerService
  ) {}

  public mapToGame(serverGame: ContractGame): Game {
    const heroes = serverGame.heroes.map(hero => this.mapToHero(hero));
    const areas = serverGame.areas.map(area => this.mapToArea(area, heroes));
    for(const hero of heroes) {
      hero.areaHero = areas
        .map(a => a.heroes.find(h => h.heroId === hero.id))
        .find(h => h !== undefined);
    }
    const completedAreaTypes = serverGame.completedAreaTypeKeys.map(key => this.assetManagerService.getAreaType(key));
    const availableAreaTypes = serverGame.availableAreaTypeKeys.map(key => this.assetManagerService.getAreaType(key));
    const allAreaTypes = this.assetManagerService
      .getAllAreaTypes()
      .map(
        areaType => this.mapToAreaType(
          areaType,
          completedAreaTypes.some(completed => completed === areaType),
          availableAreaTypes.some(available => available === areaType),
          areas.filter(area => area.type === areaType)
        )
      );

    const items = serverGame.items.map(item => this.mapToItem(item));

    return new Game(
      serverGame.id,
      serverGame.createdAt,
      serverGame.settings,
      heroes,
      areas,
      completedAreaTypes,
      availableAreaTypes,
      allAreaTypes,
      items,
      serverGame.maximumAmountOfHeroes
    );
  }

  public mapToHero(serverHero: ContractHero): Hero {
    const heroType = this.assetManagerService.getHeroType(serverHero.typeKey);
    const attributes = this.mapToAttributeSetValues(serverHero.attributes);
    const inventory = this.mapToInventory(serverHero.inventory);

    return new Hero (
      serverHero.id,
      heroType,
      serverHero.name,
      serverHero.level,
      serverHero.experience,
      attributes,
      inventory,
      serverHero.cosmetics.eyesId,
      serverHero.cosmetics.noseId,
      serverHero.cosmetics.mouthId
    );
  }

  public mapToInventory(serverInventory: ContractInventory): Inventory {
    const head = serverInventory.head ? this.mapToItem(serverInventory.head) : undefined;
    const leftHand = serverInventory.leftHand ? this.mapToItem(serverInventory.leftHand) : undefined;
    const rightHand = serverInventory.rightHand ? this.mapToItem(serverInventory.rightHand) : undefined;
    const chest = serverInventory.chest ? this.mapToItem(serverInventory.chest) : undefined;
    const legs = serverInventory.legs ? this.mapToItem(serverInventory.legs) : undefined;
    const leftFoot = serverInventory.leftFoot ? this.mapToItem(serverInventory.leftFoot) : undefined;
    const rightFoot = serverInventory.rightFoot ? this.mapToItem(serverInventory.rightFoot) : undefined;
    return new Inventory(head, leftHand, rightHand, chest, legs, leftFoot, rightFoot);
  }

  public mapToAreaType(areaType: AreaType, isCompleted: boolean, isAvailable: boolean, areas: Area[]): GameAreaType {
    return new GameAreaType(areaType, isCompleted, isAvailable, areas);
  }

  public mapToArea(serverArea: ContractArea, heroes: Hero[]): Area {
    const areaType = this.assetManagerService.getAreaType(serverArea.typeKey);
    const currentCombat = this.mapToCombat(serverArea.currentCombat);
    const areaHeroes = serverArea.heroes.map(areaHero => { 
      const combatCharacter = currentCombat.team1
        .concat(currentCombat.team2)
        .find(cc => cc.id === areaHero.combatCharacterId);
      if (!combatCharacter) {
        throw Error(`Combat character is not in this area.`);
      }
      const hero = heroes.find(h => h.id === areaHero.heroId);
      if (!hero) {
        throw Error (`No hero found with id: ${areaHero.heroId}.`);
      }
      combatCharacter.hero = hero;
      return this.mapToAreaHero(areaHero, combatCharacter);
    });
    const loot = this.mapToLoot(serverArea.loot)

    return new Area (
      serverArea.id,
      areaType,
      areaHeroes,
      currentCombat,
      serverArea.totalAmountOfCombats,
      serverArea.currentCombatNumber,
      loot
    );
  }

  public mapToCombat(serverCombat: ContractCombat): Combat {
    const team1 = serverCombat.team1.map(cc => this.mapToCombatCharacter(cc));
    const team2 = serverCombat.team2.map(cc => this.mapToCombatCharacter(cc));

    const allCharacters = [...team1, ...team2];
    const allServerCharacters = [...serverCombat.team1, ...serverCombat.team2]
    for(const character of allCharacters) {
      const serverCharacter = allServerCharacters.find(c => c.id === character.id);
      const targetOfAbilityBeingUsed = allCharacters.find(c => c.id === serverCharacter!.idOfTargetOfAbilityBeingUsed);
      character.targetOfAbilityBeingUsed = targetOfAbilityBeingUsed;
    }

    return new Combat(
      serverCombat.id,
      team1,
      team2,
      serverCombat.hasEnded,
      serverCombat.didTeam1Win
    );
  }

  public mapToAreaHero(serverAreaHero: ContractAreaHero, combatCharacter: CombatCharacter): AreaHero {
    return new AreaHero(
      serverAreaHero.gameId,
      serverAreaHero.heroId,
      combatCharacter
    );
  }

  public mapToCombatCharacter(serverCombatCharacter: ContractCombatCharacter): CombatCharacter {
    const attributeSetValues = this.mapToAttributeSetValues(serverCombatCharacter.attributes);
    const abilities = serverCombatCharacter.abilities.map(ability => this.mapToCombatCharacterAbility(ability));
    const abilityBeingUsed = abilities.find(ability => ability.id === serverCombatCharacter.idOfAbilityBeingUsed);
    return new CombatCharacter(
      serverCombatCharacter.id,
      serverCombatCharacter.typeKey,
      serverCombatCharacter.controllingUserId,
      serverCombatCharacter.name,
      serverCombatCharacter.currentHealth,
      attributeSetValues,
      abilities,
      serverCombatCharacter.remainingTimeToUseAbility,
      serverCombatCharacter.totalTimeToUseAbility,
      abilityBeingUsed
    );
  }

  public mapToAttributeSetValues(serverAttributeSet: ContractAttribute[]): AttributeSet {
    const clientAttributes = serverAttributeSet.map(serverAttribute => new Attribute(
      serverAttribute.type,
      serverAttribute.tag,
      serverAttribute.additiveValue,
      serverAttribute.multiplicativeValue,
      serverAttribute.value
    ));
    return new AttributeSet(clientAttributes);
  }

  public mapToCombatCharacterAbility(serverAbility: ContractCombatCharacterAbility): CombatCharacterAbility {
    const abilityType = this.assetManagerService.getAbilityType(serverAbility.typeKey);
    return new CombatCharacterAbility(
      serverAbility.id,
      abilityType,
      serverAbility.remainingCooldown
    );
  }

  public mapToLoot(serverLoot: ContractLoot): Loot {
    return new Loot(
      serverLoot.items.map(item => this.mapToItem(item)),
      serverLoot.gold
    );
  }

  public mapToItem(serverItem: ContractItem): Item {
    return new Item (
      serverItem.id,
      this.assetManagerService.getItemType(serverItem.typeKey),
      serverItem.innateAbilities.map(ability => this.mapToItemAbility(ability)),
      serverItem.additionalAbilities.map(ability => this.mapToItemAbility(ability))
    );
  }

  public mapToItemAbility(serverItemAbility: ContractItemAbility): ItemAbility {
    return new ItemAbility(
      this.assetManagerService.getItemAbilityType(serverItemAbility.typeKey),
      serverItemAbility.parameters
    );
  }
}
