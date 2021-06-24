import { Subscription } from 'rxjs';
import { ContractAreaCreatedMessage } from 'src/loot-hoarder-contract/server-actions/contract-area-created-message';
import { ContractGame } from 'src/loot-hoarder-contract/contract-game';
import { ContractHeroAddedMessage } from 'src/loot-hoarder-contract/server-actions/contract-hero-added-message';
import { ContractHeroDeletedMessage } from 'src/loot-hoarder-contract/server-actions/contract-hero-deleted-message';
import { ContractAreaAbandonedMessage } from 'src/loot-hoarder-contract/server-actions/contract-area-abandoned-message';
import { ContractAreaTypeCompletedMessage } from 'src/loot-hoarder-contract/server-actions/contract-area-type-completed-message';
import { ContractItemAddedToGameMessage } from 'src/loot-hoarder-contract/server-actions/contract-item-added-to-game-message';
import { ContractItemRemovedFromGameMessage } from 'src/loot-hoarder-contract/server-actions/contract-item-removed-from-game-message';
import { ContractQuestUpdatedMessage } from 'src/loot-hoarder-contract/server-actions/contract-quest-updated-message';
import { ContractAchievementUpdatedMessage } from 'src/loot-hoarder-contract/server-actions/contract-achievement-updated-message';
import { ContractHeroSlotAddedMessage } from 'src/loot-hoarder-contract/server-actions/contract-hero-slot-added-message';
import { ContractGameTabUnlockedMessage } from 'src/loot-hoarder-contract/server-actions/contract-game-tab-unlocked-message';
import { DbGame } from 'src/raw-game-state/db-game';
import { StaticGameContentService } from 'src/services/static-game-content-service';
import { Area } from './area/area';
import { AreaType } from './area/area-type';
import { Hero } from './hero';
import { GameSettings } from './game-settings';
import { Item } from './item';
import { ContractInventoryPosition } from 'src/loot-hoarder-contract/contract-inventory-position';
import { WebSocketEventStream } from './web-socket-event-stream';
import { EventStream } from './event-stream';
import { Quest } from './quest';
import { Accomplishment } from './accomplishment';
import { GameTab } from './game-tab';
import { QuestRewardUnlockTab } from './quest-reward-unlock-tab';
import { ContractQuestTypeStatus } from 'src/loot-hoarder-contract/contract-quest-type-status';
import { ContractGameTab } from 'src/loot-hoarder-contract/contract-game-tab';
import { ContractGameTabKey } from 'src/loot-hoarder-contract/contract-game-tab-key';
import { QuestRewardHeroSlot } from './quest-reward-hero-slot';
import { AccomplishmentTypeCompleteSpecificAreaType } from './accomplishment-type-complete-specific-area-type';
import { Achievement } from './achievement';
import { Combat } from './area/combat';
import { AccomplishmentTypeDefeatMonsters } from './accomplishment-type-defeat-monsters';
import { AccomplishmentTypeDefeatSpecificMonsterType } from './accomplishment-type-defeat-specific-monster-type';
import { Inventory } from './inventory';
import { AccomplishmentTypeFullInventory } from './accomplishment-type-full-inventory';
import { ContractAchievementTypeStatus } from 'src/loot-hoarder-contract/contract-achievement-type-status';

export class Game {
  public heroes: Hero[];
  public completedAreaTypes: AreaType[];
  public availableAreaTypes!: AreaType[];
  public areas: Area[];
  public onHeroLevelUp: EventStream<Hero>;
  public onEvent: WebSocketEventStream;
  public settings: GameSettings;
  public items: Item[];
  public quests: Quest[];
  public achievements: Achievement[];
  public disabledTabs: GameTab[];
  public maximumAmountOfHeroes: number;
  
  private dbModel: DbGame;
  private areaSubscriptions: Map<Area, Subscription[]>;

  private constructor(
    dbModel: DbGame,
    settings: GameSettings,
    heroes: Hero[],
    completedAreaTypes: AreaType[],
    areas: Area[],
    items: Item[],
    quests: Quest[],
    achievements: Achievement[],
  ) {
    this.dbModel = dbModel;
    this.settings = settings;
    this.heroes = heroes;
    this.completedAreaTypes = completedAreaTypes;
    this.areas = areas;
    this.items = items;
    this.quests = quests;
    this.achievements = achievements;
    this.maximumAmountOfHeroes = 1;
    this.availableAreaTypes = this.calculateAvailableAreaTypes();
    this.disabledTabs = this.calculateDisabledTabs();
    for(const completeQuest of this.quests.filter(q => q.isComplete)) {
      this.applyQuestRewards(completeQuest);
    }

    this.onHeroLevelUp = new EventStream();
    this.onEvent = new WebSocketEventStream();

    this.areaSubscriptions = new Map();
    this.setUpEventListeners();
  }

  public get id(): number { return this.dbModel.id; }
  public get userId(): number { return this.dbModel.userId; }
  public get createdAt(): Date { return this.dbModel.createdAt; }
  
  public getNextHeroId(): number {
    return this.dbModel.state.nextHeroId++;
  }
  
  public getNextAreaId(): number {
    return this.dbModel.state.nextAreaId++;
  }
  
  public getNextCombatId(): number {
    return this.dbModel.state.nextCombatId++;
  }
  
  public getNextCombatCharacterAbilityId(): number {
    return this.dbModel.state.nextCombatCharacterAbilityId++;
  }
  
  public getNextItemId(): number {
    return this.dbModel.state.nextItemId++;
  }
  
  public getNextContinuousEffectId(): number {
    return this.dbModel.state.nextContinuousEffectId++;
  }

  public getHero(heroId: number): Hero {
    const hero = this.heroes.find(h => h.id === heroId);
    if (!hero) {
      throw Error (`Hero with id ${heroId} does not exist.`);
    }
    return hero;
  }

  public addHero(hero: Hero): void {
    this.dbModel.state.heroes.push(hero.dbModel);
    this.heroes.push(hero);

    this.setUpEventListenersForHero(hero);
    this.onEvent.next(new ContractHeroAddedMessage(hero.toContractModel()));
  }

  public removeHero(hero: Hero): void {
    const dbHero = this.dbModel.state.heroes.find(h => h.id === hero.id);
    if (!dbHero) {
      throw Error(`Attempted to delete hero with id ${hero.id}, but that hero does not exist.`);
    }
    const isHeroInAnArea = this.areas.some(area => area.heroes.some(areaHero => areaHero.hero === hero));
    if (isHeroInAnArea) {
      throw Error (`Attempted to delete hero with id ${hero.id}, but that hero is in an area, so it cannot be deleted.`);
    }
    this.onEvent.setUpNewEventBucket();
    for(const inventoryPosition of Object.values(ContractInventoryPosition)) {
      const item = hero.inventory.getItemAtPosition(inventoryPosition);
      hero.unequipItem(inventoryPosition);
    }
    this.dbModel.state.heroes.splice(this.dbModel.state.heroes.indexOf(dbHero), 1);
    this.heroes.splice(this.heroes.indexOf(hero), 1);
    const heroDeletedMessage = new ContractHeroDeletedMessage(hero.id);
    this.onEvent.next(heroDeletedMessage);
    const multimessage = this.onEvent.flushEventBucketAsMultimessage();
    this.onEvent.next(multimessage);
  }

  public getArea(id: number): Area {
    const area = this.areas.find(a => a.id === id);
    if (!area) {
      throw Error (`Area with id: ${id} does not exist on this game.`);
    }
    return area;
  }

  public addArea(area: Area): void {
    this.dbModel.state.areas.push(area.dbModel);
    this.areas.push(area);
    
    this.setUpEventListenersForArea(area);
    this.onEvent.next(new ContractAreaCreatedMessage(area.toContractModel()));
  }

  public addItem(item: Item): void {
    this.dbModel.state.items.push(item.dbModel);
    this.items.push(item);
    this.onEvent.next(new ContractItemAddedToGameMessage(item.toContractModel()));
  }

  public removeItem(itemId: number): void {
    const itemIndex = this.items.findIndex(i => i.id === itemId);
    if (itemIndex >= 0) {
      this.items.splice(itemIndex, 1);
      this.onEvent.next(new ContractItemRemovedFromGameMessage(itemId));
    }
  }

  public takeLootAndLeaveArea(area: Area): void {
    area.loot.items.forEach(item => this.addItem(item));
    this.dbModel.state.areas = this.dbModel.state.areas.filter(dbA => dbA !== area.dbModel);
    this.areas = this.areas.filter(a => a !== area);
    this.removeEventListenersForArea(area);
    const message = new ContractAreaAbandonedMessage(area.id);
    this.onEvent.next(message);
  }

  public findHero(heroId: number): Hero | undefined {
    return this.heroes.find(h => h.id === heroId);
  }

  public toContractModel(): ContractGame {
    const completedQuestKeys = this.quests
      .filter(q => q.isComplete)
      .map(q => q.type.key);

    const questTypeStatuses: ContractQuestTypeStatus[] = this.quests
      .filter(q => q.isBegun && !q.isComplete)
      .map(q => {
        return {
          typeKey: q.type.key,
          accomplishmentCompletedAmount: q.accomplishments.map(a => a.completedAmount)
        };
      });

    const completedAchievementKeys = this.achievements
      .filter(achievement => achievement.isComplete)
      .map(achievement => achievement.type.key);

    const achievementTypeStatuses: ContractAchievementTypeStatus[] = this.achievements
      .filter(achievement => achievement.isBegun && !achievement.isComplete)
      .map(achievement => {
        return {
          typeKey: achievement.type.key,
          accomplishmentCompletedAmount: achievement.accomplishments.map(a => a.completedAmount)
        };
      });

    const disabledGameTabs: ContractGameTab[] = this.disabledTabs.map(tab => {
      return {
        parentTabKey: tab.parentTabKey,
        childTabKey: tab.childTabKey
      };
    });

    return {
      id: this.id,
      createdAt: this.createdAt,
      heroes: this.heroes.map(h => h.toContractModel()),
      areas: this.areas.map(a => a.toContractModel()),
      availableAreaTypeKeys: this.availableAreaTypes.map(a => a.key),
      completedAreaTypeKeys: this.completedAreaTypes.map(a => a.key),
      completedAchievementTypeKeys: completedAchievementKeys,
      completedQuestTypeKeys: completedQuestKeys,
      achievementTypeStatuses: achievementTypeStatuses,
      questTypeStatuses: questTypeStatuses,
      disabledGameTabs: disabledGameTabs,
      settings: this.settings.getUIState(),
      items: this.items.map(item => item.toContractModel()),
      maximumAmountOfHeroes: this.maximumAmountOfHeroes
    };
  }

  private calculateAvailableAreaTypes(): AreaType[] {
    const firstAreaType = StaticGameContentService.instance.getAreaType('forest');
    const availableAreaTypes = this.completedAreaTypes
      .map(a => a.adjacentAreaTypes)
      .reduce((acc, x) => acc.concat(x), [])
      .concat(firstAreaType);
    const uniqueAvailableAreaTypes = [...new Set(availableAreaTypes)];
    return uniqueAvailableAreaTypes;
  }

  private getAllIncompleteAccomplishments(): Accomplishment[] {
    const questAccomplishments = this.quests
      .filter(q => !q.isComplete)
      .map(q => q.accomplishments)
      .reduce((a1, a2) => a1.concat(a2), []);

    const achievementAccomplishments = this.achievements
      .filter(a => !a.isComplete)
      .map(a => a.accomplishments)
      .reduce((a1, a2) => a1.concat(a2), []);

    const allAccomplishments = questAccomplishments.concat(achievementAccomplishments);
    const incompleteAccomplishments = allAccomplishments.filter(a => !a.isComplete);

    return incompleteAccomplishments;
  }

  private handleAreaCompleted(area: Area): void {
    const areaType = area.type;
    if (!this.completedAreaTypes.includes(areaType)) {
      this.dbModel.state.completedAreaTypes.push(areaType.key);
      this.completedAreaTypes.push(areaType);
      const previousAvailableAreaTypes = this.availableAreaTypes;
      const currentAvailableAreaTypes = this.calculateAvailableAreaTypes();
      const newAvailableAreaTypeKeys = currentAvailableAreaTypes
        .filter(a => !previousAvailableAreaTypes.includes(a))
        .map(a => a.key);
      this.availableAreaTypes = currentAvailableAreaTypes;
      this.onEvent.next(new ContractAreaTypeCompletedMessage(areaType.key, newAvailableAreaTypeKeys));
    }

    const incompleteAccomplishments = this.getAllIncompleteAccomplishments();
    for(const accomplishment of incompleteAccomplishments) {
      if (accomplishment.type instanceof AccomplishmentTypeCompleteSpecificAreaType) {
        if (accomplishment.type.areaType === areaType) {
          accomplishment.completedAmount++;
        }
      }
    }
  }

  private handleCombatCompleted(combat: Combat): void {
    if (combat.didTeam1Win) {
      const incompleteAccomplishments = this.getAllIncompleteAccomplishments();
      for(const accomplishment of incompleteAccomplishments) {
        const accomplishmentType = accomplishment.type;
        if (accomplishmentType instanceof AccomplishmentTypeDefeatMonsters) {
          accomplishment.completedAmount += combat.team2.length;
        } else if (accomplishmentType instanceof AccomplishmentTypeDefeatSpecificMonsterType) {
          const amountOfMonstersWithType = combat.team2
            .filter(c => c.typeKey === accomplishmentType.monsterType.key)
            .length;
            
          accomplishment.completedAmount += amountOfMonstersWithType;
        }
      }
    }
  }

  private calculateDisabledTabs(): GameTab[] {
    const unlockTabRewards = this.quests
      .map(q => q.type.rewards.concat(q.type.hiddenRewards))
      .reduce((r1, r2) => r1.concat(r2), [])
      .filter(reward => reward instanceof QuestRewardUnlockTab) as QuestRewardUnlockTab[];

    const tabs = unlockTabRewards.map(reward => new GameTab(reward.parentTabKey, reward.childTabKey));
    return tabs;
  }

  private setUpEventListeners(): void {
    for(const area of this.areas) {
      this.setUpEventListenersForArea(area);
    }
    for(const hero of this.heroes) {
      this.setUpEventListenersForHero(hero);
    }
    for(const quest of this.quests) {
      this.setUpEventListenersForQuest(quest);
    }
    for(const achievement of this.achievements) {
      this.setUpEventListenersForAchievement(achievement);
    }
  }

  private setUpEventListenersForArea(area: Area): void {
    const subscriptions = [
      area.onEvent.subscribe(event => this.onEvent.next(event)),
      area.onAreaComplete.subscribe(() => this.handleAreaCompleted(area)),
      area.onCombatComplete.subscribe(combat => this.handleCombatCompleted(combat))
    ];
    this.areaSubscriptions.set(area, subscriptions); 
  }

  private removeEventListenersForArea(area: Area): void {
    const subscriptions = this.areaSubscriptions.get(area);

    if (!subscriptions) {
      throw Error ('Event listeners were never set up for area.');
    }

    this.unsubscribeToSubscriptions(subscriptions);
  }

  private setUpEventListenersForHero(hero: Hero): void {
    hero.onEvent.subscribe(event => this.onEvent.next(event));

    hero.onItemUnequipped.subscribe(event => this.addItem(event.item));

    hero.onItemEquipped.subscribe(event => {
      if (hero.inventory.getAllItems().length === Inventory.numberOfInventoryItemSlots) {
        for(const accomplishment of this.getAllIncompleteAccomplishments()) {
          if (accomplishment.type instanceof AccomplishmentTypeFullInventory) {
            accomplishment.completedAmount++;
          }
        }
      }
    });

    hero.onLevelUp.subscribe(event => this.onHeroLevelUp.next(hero));
  }

  private setUpEventListenersForQuest(quest: Quest): void {
    quest.onUpdate.subscribe(() => {
      if (quest.isComplete) {
        this.applyQuestRewards(quest);
      }
      const accomplishmentCompletedAmount = quest.accomplishments.map(a => a.completedAmount);
      const message = new ContractQuestUpdatedMessage(quest.type.key, accomplishmentCompletedAmount, quest.isComplete);
      this.onEvent.next(message);
    });
  }

  private setUpEventListenersForAchievement(achievement: Achievement): void {
    achievement.onUpdate.subscribe(() => {
      const accomplishmentCompletedAmount = achievement.accomplishments.map(a => a.completedAmount);
      const message = new ContractAchievementUpdatedMessage(achievement.type.key, accomplishmentCompletedAmount, achievement.isComplete);
      this.onEvent.next(message);
    });
  }

  private applyQuestRewards(quest: Quest): void {
    const allRewards = quest.type.rewards.concat(quest.type.hiddenRewards);
    for(const reward of allRewards) {
      if (reward instanceof QuestRewardUnlockTab) {
        this.unlockTab(reward.parentTabKey, reward.childTabKey);
      } else if (reward instanceof QuestRewardHeroSlot) {
        this.maximumAmountOfHeroes++;
        const message = new ContractHeroSlotAddedMessage();
        this.onEvent.next(message);
      } else {
        throw Error (`Unhandled quest reward type ${reward.type.key}.`);
      }
    }
  }

  private unlockTab(parentTabKey: ContractGameTabKey, childTabKey: string | undefined): void {
    const disabledTabIndex = this.disabledTabs.findIndex(t => t.parentTabKey === parentTabKey && t.childTabKey === childTabKey);
    if (disabledTabIndex >= 0) {
      this.disabledTabs.splice(disabledTabIndex, 1);
      const message = new ContractGameTabUnlockedMessage(parentTabKey, childTabKey);
      this.onEvent.next(message);
    }
  }

  private unsubscribeToSubscriptions(subscriptions: Subscription[]): void {
    for(const subscription of subscriptions) {
      subscription.unsubscribe();
    }
  }

  public static load(dbModel: DbGame): Game {
    const settings = GameSettings.load(dbModel.state.settings);
    const heroes = dbModel.state.heroes.map(dbHero => Hero.load(dbHero));
    const completedAreaTypes = dbModel.state.completedAreaTypes.map(cat => StaticGameContentService.instance.getAreaType(cat));

    const areas = dbModel.state.areas.map(dbArea => Area.load(dbArea));
    const items = dbModel.state.items.map(dbItem => Item.load(dbItem));
    const allQuestTypes = StaticGameContentService.instance.getAllQuestTypes();
    const quests = allQuestTypes.map(questType => {
      const isCompleted = dbModel.state.completedQuestTypes.some(completedQuestTypeKey => completedQuestTypeKey === questType.key);
      const dbQuestStatus = dbModel.state.questTypeStatuses.find(questStatus => questStatus.typeKey === questType.key);
      const accomplishments = questType.requiredAccomplishmentTypes.map((accomplishmentType, accomplishmentIndex) => {
        let completedAmount = 0;
        if (isCompleted) {
          completedAmount = accomplishmentType.requiredAmount;
        } else if (dbQuestStatus) {
          completedAmount = dbQuestStatus.accomplishmentCompletedAmount[accomplishmentIndex];
        }

        return new Accomplishment(accomplishmentType, completedAmount);
      });
      return new Quest(questType, accomplishments);
    });
    
    const allAchievementTypes = StaticGameContentService.instance.getAllAchievementTypes();
    const achievements = allAchievementTypes.map(achievementType => {
      const isCompleted = dbModel.state.completedAchievementTypes.some(completedAchievementTypeKey => completedAchievementTypeKey === achievementType.key);
      const dbAchievementStatus = dbModel.state.achievementTypeStatuses.find(achievementStatus => achievementStatus.typeKey === achievementType.key);
      const accomplishments = achievementType.requiredAccomplishmentTypes.map((accomplishmentType, accomplishmentIndex) => {
        let completedAmount = 0;
        if (isCompleted) {
          completedAmount = accomplishmentType.requiredAmount;
        } else if (dbAchievementStatus) {
          completedAmount = dbAchievementStatus.accomplishmentCompletedAmount[accomplishmentIndex];
        }

        return new Accomplishment(accomplishmentType, completedAmount);
      });
      return new Achievement(achievementType, accomplishments);
    });

    const game = new Game(
      dbModel,
      settings,
      heroes,
      completedAreaTypes,
      areas,
      items,
      quests,
      achievements
    );
    return game;
  }
}
