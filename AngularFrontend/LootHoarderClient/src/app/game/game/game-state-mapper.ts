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
import { AssetManagerService } from "./asset-manager.service";
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
import { GameTabReference } from "./client-representation/game-tab-reference";
import { Accomplishment } from "./client-representation/accomplishment";
import { Quest } from "./client-representation/quest";
import { Achievement } from "./client-representation/achievement";
import { ContractCharacterBehavior } from "src/loot-hoarder-contract/contract-character-behavior";
import { CharacterBehavior } from "./client-representation/character-behavior/character-behavior";
import { ContractCharacterBehaviorAction } from "src/loot-hoarder-contract/contract-character-behavior-action";
import { CharacterBehaviorAction } from "./client-representation/character-behavior/character-behavior-action";
import { ContractCharacterBehaviorPredicate } from "src/loot-hoarder-contract/contract-character-behavior-predicate";
import { ContractCharacterBehaviorPredicateTypeKey } from "src/loot-hoarder-contract/contract-character-behavior-predicate-type-key";
import { CharacterBehaviorPredicateNot } from "./client-representation/character-behavior/character-behavior-predicate-not";
import { CharacterBehaviorPredicateAnd } from "./client-representation/character-behavior/character-behavior-predicate-and";
import { CharacterBehaviorPredicateOr } from "./client-representation/character-behavior/character-behavior-predicate-or";
import { CharacterBehaviorPredicateRelativeValues } from "./client-representation/character-behavior/character-behavior-predicate-relative-values";
import { CharacterBehaviorPredicateAbilityReady } from "./client-representation/character-behavior/character-behavior-predicate-ability-ready";
import { CharacterBehaviorPredicateHasContinuousEffect } from "./client-representation/character-behavior/character-behavior-predicate-has-continuous-effect";
import { ContractCharacterBehaviorTarget } from "src/loot-hoarder-contract/contract-character-behavior-target";
import { CharacterBehaviorPredicate } from "./client-representation/character-behavior/character-behavior-predicate";
import { CharacterBehaviorTarget } from "./client-representation/character-behavior/character-behavior-target";
import { ContractCharacterBehaviorTargetTypeKey } from "src/loot-hoarder-contract/contract-character-behavior-target-type-key";
import { CharacterBehaviorTargetRandomCharacter } from "./client-representation/character-behavior/character-behavior-target-random-character";
import { CharacterBehaviorTargetRandomCharacterMatchingPredicate } from "./client-representation/character-behavior/character-behavior-target-random-character-matching-predicate";
import { CharacterBehaviorTargetSpecificHero } from "./client-representation/character-behavior/character-behavior-target-specific-hero";
import { ContractCharacterBehaviorValue } from "src/loot-hoarder-contract/contract-character-behavior-value";
import { CharacterBehaviorValue } from "./client-representation/character-behavior/character-behavior-value";
import { ContractCharacterBehaviorValueTypeKey } from "src/loot-hoarder-contract/contract-character-behavior-value-type-key";
import { CharacterBehaviorValueAttribute } from "./client-representation/character-behavior/character-behavior-value-attribute";
import { CharacterBehaviorValueCurrentHealth } from "./client-representation/character-behavior/character-behavior-value-current-health";
import { CharacterBehaviorValueCurrentMana } from "./client-representation/character-behavior/character-behavior-value-current-mana";
import { CharacterBehaviorValuePercentageCurrentHealth } from "./client-representation/character-behavior/character-behavior-value-percentage-current-health";
import { CharacterBehaviorValuePercentageCurrentMana } from "./client-representation/character-behavior/character-behavior-value-percentage-current-mana";
import { CharacterBehaviorValueNumber } from "./client-representation/character-behavior/character-behavior-value-number";
import { CharacterBehaviorValueRemainingCooldownOfAbility } from "./client-representation/character-behavior/character-behavior-value-remaining-cooldown-of-ability";
import { CharacterBehaviorTargetCharacterWithExtremeValue } from "./client-representation/character-behavior/character-behavior-target-character-with-extreme-value";
import { ContractItemPassiveAbility } from "src/loot-hoarder-contract/contract-item-passive-ability";
import { ItemPassiveAbility } from "./client-representation/item-passive-ability";
import { PassiveAbilityRemoveOnTakingDamage } from "./client-representation/passive-ability-remove-on-taking-damage";

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

    const disabledGameTabs = serverGame.disabledGameTabs.map(tab => new GameTabReference(tab.parentTabKey, tab.childTabKey));

    const items = serverGame.items.map(item => this.mapToItem(item));

    const allQuestTypes = this.assetManagerService.getAllQuestTypes();
    const quests = allQuestTypes.map(questType => {
      const isCompleted = serverGame.completedQuestTypeKeys.includes(questType.key);
      const dbQuestStatus = serverGame.questTypeStatuses.find(questStatus => questStatus.typeKey === questType.key);
      const accomplishments = questType.requiredAccomplishmentTypes.map((accomplishmentType, accomplishmentIndex) => {
        let completedAmount = 0;
        if (isCompleted) {
          completedAmount = accomplishmentType.requiredAmount;
        } else if (dbQuestStatus) {
          completedAmount = dbQuestStatus.accomplishmentCompletedAmount[accomplishmentIndex];
        }

        return new Accomplishment(accomplishmentType, completedAmount);
      });
      const isAvailable = !questType.previousQuestType || serverGame.completedQuestTypeKeys.includes(questType.previousQuestType.key);
      return new Quest(questType, accomplishments, isCompleted, isAvailable);
    });

    const allAchievementTypes = this.assetManagerService.getAllAchievementTypes();
    const achievements = allAchievementTypes.map(achievementType => {
      const isCompleted = serverGame.completedAchievementTypeKeys.includes(achievementType.key);
      const dbachievementStatus = serverGame.achievementTypeStatuses.find(achievementStatus => achievementStatus.typeKey === achievementType.key);
      const accomplishments = achievementType.requiredAccomplishmentTypes.map((accomplishmentType, accomplishmentIndex) => {
        let completedAmount = 0;
        if (isCompleted) {
          completedAmount = accomplishmentType.requiredAmount;
        } else if (dbachievementStatus) {
          completedAmount = dbachievementStatus.accomplishmentCompletedAmount[accomplishmentIndex];
        }

        return new Accomplishment(accomplishmentType, completedAmount);
      });
      return new Achievement(achievementType, accomplishments, isCompleted);
    });

    return new Game(
      serverGame.id,
      serverGame.createdAt,
      serverGame.settings,
      heroes,
      areas,
      completedAreaTypes,
      availableAreaTypes,
      allAreaTypes,
      disabledGameTabs,
      items,
      quests,
      achievements,
      serverGame.maximumAmountOfHeroes,
      serverGame.gold
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
    const behaviors = serverHero.behaviors.map(behavior => this.mapCharacterBehavior(behavior, abilities));
    const currentBehavior = behaviors.find(behavior => behavior.id === serverHero.currentBehaviorId);

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
      abilities,
      behaviors,
      currentBehavior
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
      serverHeroAbility.criticalStrikeMultiplier,
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
      serverItem.innateAbilities.map(ability => this.mapToItemPassiveAbility(ability)),
      serverItem.additionalAbilities.map(ability => this.mapToItemPassiveAbility(ability)),
      serverItem.level,
      serverItem.remainingCraftPotential
    );
  }

  public mapToItemPassiveAbility(serverItemPassiveAbility: ContractItemPassiveAbility): ItemPassiveAbility {
    return new ItemPassiveAbility (
      serverItemPassiveAbility.level, 
      this.mapToPassiveAbility(serverItemPassiveAbility.ability)
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
      case ContractPassiveAbilityTypeKey.removeOnDamageTaken:
        return new PassiveAbilityRemoveOnTakingDamage(abilityType, serverPassiveAbility.parameters);
      default: 
        throw Error (`Unhandled ability type: ${abilityType.key}`);
    }
  }

  public mapCharacterBehavior(behavior: ContractCharacterBehavior, allHeroAbilities: HeroAbility[]): CharacterBehavior {
    const actions = behavior.prioritizedActions.map(action => {
      const heroAbility = allHeroAbilities.find(ability => ability.id === action.abilityId);
      if (!heroAbility) {
        throw Error (`Could not find the ability in the list of hero abilities when mapping to a character behavior action`);
      }
      return this.mapCharacterBehaviorAction(action, heroAbility, allHeroAbilities);
    });
    return new CharacterBehavior(behavior.id, behavior.name, actions);
  }

  public mapCharacterBehaviorAction(action: ContractCharacterBehaviorAction, heroAbility: HeroAbility, allHeroAbilities: HeroAbility[]): CharacterBehaviorAction {
    const predicate = action.predicate ? this.mapCharacterBehaviorPredicate(action.predicate, allHeroAbilities) : undefined;
    const target = action.target ? this.mapCharacterBehaviorTarget(action.target, allHeroAbilities) : undefined;
    return new CharacterBehaviorAction(predicate, heroAbility, target);
  }

  public mapCharacterBehaviorPredicate(predicate: ContractCharacterBehaviorPredicate, allHeroAbilities: HeroAbility[]): CharacterBehaviorPredicate {
    switch(predicate.typeKey) {
      case ContractCharacterBehaviorPredicateTypeKey.not: {
        if (!predicate.innerPredicate) {
          throw Error (`Expected an inner predicate in a ${predicate.typeKey} predicate`);
        }
        const innerPredicate = this.mapCharacterBehaviorPredicate(predicate.innerPredicate, allHeroAbilities);
        return new CharacterBehaviorPredicateNot(innerPredicate);
      }
      case ContractCharacterBehaviorPredicateTypeKey.and: {
        if (!predicate.innerPredicates) {
          throw Error (`Expected inner predicates in a ${predicate.typeKey} predicate`);
        }
        const innerPredicates = predicate.innerPredicates.map(innerPredicate => this.mapCharacterBehaviorPredicate(innerPredicate, allHeroAbilities));
        return new CharacterBehaviorPredicateAnd(innerPredicates);
      }
      case ContractCharacterBehaviorPredicateTypeKey.or: {
        if (!predicate.innerPredicates) {
          throw Error (`Expected inner predicates in a ${predicate.typeKey} predicate`);
        }
        const innerPredicates = predicate.innerPredicates.map(innerPredicate => this.mapCharacterBehaviorPredicate(innerPredicate, allHeroAbilities));
        return new CharacterBehaviorPredicateOr(innerPredicates);
      }
      case ContractCharacterBehaviorPredicateTypeKey.relativeValues: {
        if (!predicate.leftValue) {
          throw Error (`Expected a left value in a ${predicate.typeKey} predicate`);
        }
        if (!predicate.rightValue) {
          throw Error (`Expected a right value in a ${predicate.typeKey} predicate`);
        }
        if (!predicate.valueRelation) {
          throw Error (`Expected a value relation in a ${predicate.typeKey} predicate`);
        }
        const leftValue = this.mapCharacterBehaviorValue(predicate.leftValue, allHeroAbilities);
        const rightValue = this.mapCharacterBehaviorValue(predicate.rightValue, allHeroAbilities);
        return new CharacterBehaviorPredicateRelativeValues(leftValue, rightValue, predicate.valueRelation);
      }
      case ContractCharacterBehaviorPredicateTypeKey.abilityReady: {
        if (!predicate.abilityId) {
          throw Error (`Expected an ability id in a ${predicate.typeKey} predicate`);
        }
        const heroAbility = allHeroAbilities.find(ability => ability.id === predicate.abilityId);
        if (!heroAbility) {
          throw Error (`Could not find the ability in the list of hero abilities when mapping to an ability ready character behavior predicate`);
        }
        return new CharacterBehaviorPredicateAbilityReady(heroAbility);
      }
      case ContractCharacterBehaviorPredicateTypeKey.hasContinuousEffect: {
        if (!predicate.continuousEffectTypeKey) {
          throw Error (`Expected an continuous effect type key in a ${predicate.typeKey} predicate`);
        }
        const continuousEffectType = this.assetManagerService.getContinuousEffectType(predicate.continuousEffectTypeKey);
        return new CharacterBehaviorPredicateHasContinuousEffect(continuousEffectType);
      }
      default: 
        throw Error (`Unhandled behavior action predicate type: ${predicate.typeKey}`);
    }
  }

  public mapCharacterBehaviorTarget(target: ContractCharacterBehaviorTarget, allHeroAbilities: HeroAbility[]): CharacterBehaviorTarget {
    switch(target.typeKey) {
      case ContractCharacterBehaviorTargetTypeKey.randomAlly: {
        return new CharacterBehaviorTargetRandomCharacter(true, false);
      }
      case ContractCharacterBehaviorTargetTypeKey.randomEnemy: {
        return new CharacterBehaviorTargetRandomCharacter(false, true);
      }
      case ContractCharacterBehaviorTargetTypeKey.randomCharacter: {
        return new CharacterBehaviorTargetRandomCharacter(true, true);
      }
      case ContractCharacterBehaviorTargetTypeKey.randomAllyMatchingPredicate: {
        if (!target.predicate) {
          throw Error (`Expected a predicate in a ${target.typeKey} value`);
        }
        const predicate = this.mapCharacterBehaviorPredicate(target.predicate, allHeroAbilities);
        return new CharacterBehaviorTargetRandomCharacterMatchingPredicate(true, false, predicate);
      }
      case ContractCharacterBehaviorTargetTypeKey.randomEnemyMatchingPredicate: {
        if (!target.predicate) {
          throw Error (`Expected a predicate in a ${target.typeKey} value`);
        }
        const predicate = this.mapCharacterBehaviorPredicate(target.predicate, allHeroAbilities);
        return new CharacterBehaviorTargetRandomCharacterMatchingPredicate(false, true, predicate);
      }
      case ContractCharacterBehaviorTargetTypeKey.randomCharacterMatchingPredicate: {
        if (!target.predicate) {
          throw Error (`Expected a predicate in a ${target.typeKey} value`);
        }
        const predicate = this.mapCharacterBehaviorPredicate(target.predicate, allHeroAbilities);
        return new CharacterBehaviorTargetRandomCharacterMatchingPredicate(true, true, predicate);
      }
      case ContractCharacterBehaviorTargetTypeKey.specificHero: {
        if (!target.heroId) {
          throw Error (`Expected a hero id in a ${target.typeKey} value`);
        }
        return new CharacterBehaviorTargetSpecificHero(target.heroId);
      }
      case ContractCharacterBehaviorTargetTypeKey.allyWithTheLeastValue: {
        if (!target.value) {
          throw Error (`Expected a value in a ${target.typeKey} value`);
        }
        const value = this.mapCharacterBehaviorValue(target.value, allHeroAbilities);
        return new CharacterBehaviorTargetCharacterWithExtremeValue(true, false, true, value);
      }
      case ContractCharacterBehaviorTargetTypeKey.allyWithTheMostValue: {
        if (!target.value) {
          throw Error (`Expected a value in a ${target.typeKey} value`);
        }
        const value = this.mapCharacterBehaviorValue(target.value, allHeroAbilities);
        return new CharacterBehaviorTargetCharacterWithExtremeValue(true, false, false, value);
      }
      case ContractCharacterBehaviorTargetTypeKey.enemyWithTheLeastValue: {
        if (!target.value) {
          throw Error (`Expected a value in a ${target.typeKey} value`);
        }
        const value = this.mapCharacterBehaviorValue(target.value, allHeroAbilities);
        return new CharacterBehaviorTargetCharacterWithExtremeValue(false, true, true, value);
      }
      case ContractCharacterBehaviorTargetTypeKey.enemyWithTheMostValue: {
        if (!target.value) {
          throw Error (`Expected a value in a ${target.typeKey} value`);
        }
        const value = this.mapCharacterBehaviorValue(target.value, allHeroAbilities);
        return new CharacterBehaviorTargetCharacterWithExtremeValue(false, true, false, value);
      }
      case ContractCharacterBehaviorTargetTypeKey.characterWithTheLeastValue: {
        if (!target.value) {
          throw Error (`Expected a value in a ${target.typeKey} value`);
        }
        const value = this.mapCharacterBehaviorValue(target.value, allHeroAbilities);
        return new CharacterBehaviorTargetCharacterWithExtremeValue(true, true, true, value);
      }
      case ContractCharacterBehaviorTargetTypeKey.characterWithTheMostValue: {
        if (!target.value) {
          throw Error (`Expected a value in a ${target.typeKey} value`);
        }
        const value = this.mapCharacterBehaviorValue(target.value, allHeroAbilities);
        return new CharacterBehaviorTargetCharacterWithExtremeValue(true, true, false, value);
      }
      default: 
        throw Error (`Unhandled behavior action target type: ${target.typeKey}`);
    }
  }

  public mapCharacterBehaviorValue(value: ContractCharacterBehaviorValue, allHeroAbilities: HeroAbility[]): CharacterBehaviorValue {
    switch(value.typeKey) {
      case ContractCharacterBehaviorValueTypeKey.attribute: {
        if (!value.attributeTypeKey) {
          throw Error (`Expected an attribute type key in a ${value.typeKey} value`);
        }
        if (!value.attributeAbilityTags) {
          throw Error (`Expected attribute ability tags in a ${value.typeKey} value`);
        }
        return new CharacterBehaviorValueAttribute(value.attributeTypeKey, value.attributeAbilityTags);
      }
      case ContractCharacterBehaviorValueTypeKey.currentHealth: {
        return new CharacterBehaviorValueCurrentHealth();
      }
      case ContractCharacterBehaviorValueTypeKey.currentMana: {
        return new CharacterBehaviorValueCurrentMana();
      }
      case ContractCharacterBehaviorValueTypeKey.percentageCurrentHealth: {
        return new CharacterBehaviorValuePercentageCurrentHealth();
      }
      case ContractCharacterBehaviorValueTypeKey.percentageCurrentMana: {
        return new CharacterBehaviorValuePercentageCurrentMana();
      }
      case ContractCharacterBehaviorValueTypeKey.number: {
        if (!value.number) {
          throw Error (`Expected a number in a ${value.typeKey} value`);
        }
        return new CharacterBehaviorValueNumber(value.number);
      }
      case ContractCharacterBehaviorValueTypeKey.remainingCooldownOfAbility: {
        if (!value.abilityId) {
          throw Error (`Expected an ability id in a ${value.typeKey} value`);
        }
        const heroAbility = allHeroAbilities.find(ability => ability.id === value.abilityId);
        if (!heroAbility) {
          throw Error (`Could not find the ability in the list of hero abilities when mapping to a remaining cooldown of ability behavior value`);
        }
        return new CharacterBehaviorValueRemainingCooldownOfAbility(heroAbility);
      }
      default: 
        throw Error (`Unhandled behavior value type: ${value.typeKey}`);
    }
  }
}
