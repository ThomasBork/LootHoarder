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
import { ContractContinuousEffect } from "src/loot-hoarder-contract/server-actions/combat-messages/contract-continuous-effect";
import { CombatCharacterAbility } from "./client-representation/combat-character-ability";
import { ContractAttribute } from "src/loot-hoarder-contract/contract-attribute";
import { Attribute } from "./client-representation/attribute";
import { Item } from "./client-representation/item";
import { PassiveAbility } from "./client-representation/passive-ability";
import { ContractItem } from "src/loot-hoarder-contract/contract-item";
import { ContractInventory } from "src/loot-hoarder-contract/contract-inventory";
import { Inventory } from "./client-representation/inventory";
import { ContractPassiveAbility } from "src/loot-hoarder-contract/contract-passive-ability";
import { HeroSkillTreeStatus } from "./client-representation/hero-skill-tree-status";
import { HeroSkillTreeNodeStatus } from "./client-representation/hero-skill-tree-node-status";
import { ContinuousEffect } from "./client-representation/continuous-effect";
import { ContractHeroAbility } from "src/loot-hoarder-contract/contract-hero-ability";
import { HeroAbility } from "./client-representation/hero-ability";
import { AbilityEffect } from "./client-representation/ability-effect";
import { ContractAbilityEffect } from "src/loot-hoarder-contract/contract-ability-effect";
import { ContractPassiveAbilityTypeKey } from "src/loot-hoarder-contract/contract-passive-ability-type-key";
import { PassiveAbilityAttribute } from "./client-representation/passive-ability-attribute";
import { PassiveAbilityUnlockAbility } from "./client-representation/passive-ability-unlock-ability";
import { PassiveAbilityTakeDamageOverTime } from "./client-representation/passive-ability-take-damage-over-time";

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
        .map(a => a.heroes.find(h => h.gameHero === hero))
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
    const skillTree = this.assetManagerService.getHeroSkillTree();
    const skillTreeWithStatus = new HeroSkillTreeStatus(
      skillTree.nodes.map(node => new HeroSkillTreeNodeStatus(
        node, 
        serverHero.availableSkillNodes.some(location => location.x === node.x && location.y === node.y),
        serverHero.takenSkillNodes.some(location => location.x === node.x && location.y === node.y)
      )),
      skillTree.transitions
    );
    const abilities = serverHero.abilities.map(ability => this.mapToHeroAbility(ability));

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
      serverHero.cosmetics.mouthId,
      serverHero.unspentSkillPoints,
      skillTreeWithStatus,
      abilities
    );
  }

  public mapToHeroAbility(serverHeroAbility: ContractHeroAbility): HeroAbility {
    const type = this.assetManagerService.getAbilityType(serverHeroAbility.typeKey);
    const effects = serverHeroAbility.effects.map(effect => this.mapToAbilityEffect(effect));
    return new HeroAbility(
      serverHeroAbility.id, 
      type, 
      serverHeroAbility.isEnabled,
      effects,
      serverHeroAbility.useSpeed,
      serverHeroAbility.cooldownSpeed,
      serverHeroAbility.cooldown,
      serverHeroAbility.manaCost,
      serverHeroAbility.criticalStrikeChance,
      serverHeroAbility.timeToUse
    );
  }

  public mapToAbilityEffect(serverAbilityEffect: ContractAbilityEffect): AbilityEffect {
    const abilityType = this.assetManagerService.getAbilityType(serverAbilityEffect.abilityTypeKey);
    const abilityTypeEffect = abilityType.effects[serverAbilityEffect.abilityTypeEffectTypeIndex];
    return new AbilityEffect(
      abilityType,
      abilityTypeEffect,
      serverAbilityEffect.power
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
    const areaHeroes = serverArea.heroes.map(serverAreaHero => { 
      const combatCharacter = currentCombat.team1
        .concat(currentCombat.team2)
        .find(cc => cc.id === serverAreaHero.combatCharacterId);
      if (!combatCharacter) {
        throw Error(`Combat character is not in this area.`);
      }
      const hero = heroes.find(h => h.id === serverAreaHero.heroId);
      if (!hero) {
        throw Error (`No hero found with id: ${serverAreaHero.heroId}.`);
      }
      combatCharacter.hero = hero;
      const areaHero = this.mapToAreaHero(serverAreaHero, hero, combatCharacter);
      hero.areaHero = areaHero;
      return areaHero;
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

  public mapToAreaHero(serverAreaHero: ContractAreaHero, gameHero: Hero, combatCharacter: CombatCharacter): AreaHero {
    return new AreaHero(
      gameHero,
      combatCharacter
    );
  }

  public mapToCombatCharacter(serverCombatCharacter: ContractCombatCharacter): CombatCharacter {
    const attributeSetValues = this.mapToAttributeSetValues(serverCombatCharacter.attributes);
    const abilities = serverCombatCharacter.abilities.map(ability => this.mapToCombatCharacterAbility(ability));
    const abilityBeingUsed = abilities.find(ability => ability.id === serverCombatCharacter.idOfAbilityBeingUsed);
    const continuousEffects = serverCombatCharacter.continuousEffects.map(continuousEffect => this.mapToContinuousEffect(continuousEffect));
    return new CombatCharacter(
      serverCombatCharacter.id,
      serverCombatCharacter.typeKey,
      serverCombatCharacter.controllingUserId,
      serverCombatCharacter.name,
      serverCombatCharacter.currentHealth,
      serverCombatCharacter.currentMana,
      attributeSetValues,
      abilities,
      serverCombatCharacter.remainingTimeToUseAbility,
      serverCombatCharacter.totalTimeToUseAbility,
      abilityBeingUsed,
      continuousEffects
    );
  }

  public mapToContinuousEffect(serverContinuousEffect: ContractContinuousEffect): ContinuousEffect {
    const type = this.assetManagerService.getContinuousEffectType(serverContinuousEffect.typeKey);
    const abilities = serverContinuousEffect.abilities.map(ability => this.mapToPassiveAbility(ability));

    return new ContinuousEffect(
      serverContinuousEffect.id,
      type,
      abilities,
      serverContinuousEffect.timeRemaining,
      serverContinuousEffect.lastsIndefinitely
    )
  }

  public mapToAttributeSetValues(serverAttributeSet: ContractAttribute[]): AttributeSet {
    const clientAttributes = serverAttributeSet.map(serverAttribute => new Attribute(
      serverAttribute.type,
      serverAttribute.tags,
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
      serverAbility.cooldown,
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
      serverItem.innateAbilities.map(ability => this.mapToPassiveAbility(ability)),
      serverItem.additionalAbilities.map(ability => this.mapToPassiveAbility(ability))
    );
  }

  public mapToPassiveAbility(serverPassiveAbility: ContractPassiveAbility): PassiveAbility {
    const abilityType = this.assetManagerService.getPassiveAbilityType(serverPassiveAbility.typeKey);
    switch(abilityType.key) {
      case ContractPassiveAbilityTypeKey.attribute:
        return new PassiveAbilityAttribute(abilityType, serverPassiveAbility.parameters);
      case ContractPassiveAbilityTypeKey.takeDamageOverTime:
        return new PassiveAbilityTakeDamageOverTime(abilityType, serverPassiveAbility.parameters, serverPassiveAbility.parameters.damagePerSecond);
      case ContractPassiveAbilityTypeKey.unlockAbility:
        return new PassiveAbilityUnlockAbility(abilityType, serverPassiveAbility.parameters);
      default: 
        throw Error (`Unhandled ability type: ${abilityType.key}`);
    }
  }
}
