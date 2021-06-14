import { Subscription } from 'rxjs';
import { ContractAreaCreatedMessage } from 'src/loot-hoarder-contract/server-actions/contract-area-created-message';
import { ContractGame } from 'src/loot-hoarder-contract/contract-game';
import { ContractHeroAddedMessage } from 'src/loot-hoarder-contract/server-actions/contract-hero-added-message';
import { ContractHeroDeletedMessage } from 'src/loot-hoarder-contract/server-actions/contract-hero-deleted-message';
import { ContractAreaAbandonedMessage } from 'src/loot-hoarder-contract/server-actions/contract-area-abandoned-message';
import { ContractAreaTypeCompletedMessage } from 'src/loot-hoarder-contract/server-actions/contract-area-type-completed-message';
import { ContractItemAddedToGameMessage } from 'src/loot-hoarder-contract/server-actions/contract-item-added-to-game-message';
import { ContractItemRemovedFromGameMessage } from 'src/loot-hoarder-contract/server-actions/contract-item-removed-from-game-message';
import { DbGame } from 'src/raw-game-state/db-game';
import { StaticGameContentService } from 'src/services/static-game-content-service';
import { Area } from './area/area';
import { AreaType } from './area/area-type';
import { Hero } from './hero';
import { GameSettings } from './game-settings';
import { Item } from './item';
import { ValueContainer } from './value-container';
import { ContractInventoryPosition } from 'src/loot-hoarder-contract/contract-inventory-position';
import { WebSocketEventStream } from './web-socket-event-stream';

export class Game {
  public heroes: Hero[];
  public completedAreaTypes: AreaType[];
  public availableAreaTypes!: AreaType[];
  public areas: Area[];
  public onEvent: WebSocketEventStream;
  public settings: GameSettings;
  public items: Item[];
  public maximumAmountOfHeroesVC: ValueContainer;
  
  private dbModel: DbGame;
  private areaSubscriptions: Map<Area, Subscription[]>;

  private constructor(
    dbModel: DbGame,
    settings: GameSettings,
    heroes: Hero[],
    completedAreaTypes: AreaType[],
    areas: Area[],
    items: Item[]
  ) {
    this.dbModel = dbModel;
    this.settings = settings;
    this.heroes = heroes;
    this.completedAreaTypes = completedAreaTypes;
    this.areas = areas;
    this.items = items;
    this.maximumAmountOfHeroesVC = new ValueContainer(3);
    this.availableAreaTypes = this.calculateAvailableAreaTypes();

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
    return {
      id: this.id,
      createdAt: this.createdAt,
      heroes: this.heroes.map(h => h.toContractModel()),
      areas: this.areas.map(a => a.toContractModel()),
      availableAreaTypeKeys: this.availableAreaTypes.map(a => a.key),
      completedAreaTypeKeys: this.completedAreaTypes.map(a => a.key),
      settings: this.settings.getUIState(),
      items: this.items.map(item => item.toContractModel()),
      maximumAmountOfHeroes: this.maximumAmountOfHeroesVC.value
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
  }

  private setUpEventListeners(): void {
    for(const area of this.areas) {
      this.setUpEventListenersForArea(area);
    }
    for(const hero of this.heroes) {
      this.setUpEventListenersForHero(hero);
    }
  }

  private setUpEventListenersForArea(area: Area): void {
    const subscriptions = [
      area.onEvent.subscribe(event => this.onEvent.next(event)),
      area.onAreaComplete.subscribe(() => this.handleAreaCompleted(area))
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

    const game = new Game(
      dbModel,
      settings,
      heroes,
      completedAreaTypes,
      areas,
      items
    );
    return game;
  }
}
