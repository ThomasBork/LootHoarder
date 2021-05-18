import { Observable, Subject, Subscription } from 'rxjs';
import { ContractAreaCreatedMessage } from 'src/loot-hoarder-contract/server-actions/contract-area-created-message';
import { ContractGame } from 'src/loot-hoarder-contract/contract-game';
import { ContractHeroAddedMessage } from 'src/loot-hoarder-contract/server-actions/contract-hero-added-message';
import { ContractAreaAbandonedMessage } from 'src/loot-hoarder-contract/server-actions/contract-area-abandoned-message';
import { ContractAreaTypeCompletedMessage } from 'src/loot-hoarder-contract/server-actions/contract-area-type-completed-message';
import { ContractItemAddedToGameMessage } from 'src/loot-hoarder-contract/server-actions/contract-item-added-to-game-message';
import { ContractItemRemovedFromGameMessage } from 'src/loot-hoarder-contract/server-actions/contract-item-removed-from-game-message';
import { ContractServerWebSocketMessage } from 'src/loot-hoarder-contract/server-actions/contract-server-web-socket-message';
import { DbGame } from 'src/raw-game-state/db-game';
import { StaticGameContentService } from 'src/services/static-game-content-service';
import { Area } from './area/area';
import { AreaType } from './area/area-type';
import { Hero } from './hero';
import { GameSettings } from './game-settings';
import { Item } from './item';

export class Game {
  public heroes: Hero[];
  public completedAreaTypes: AreaType[];
  public availableAreaTypes!: AreaType[];
  public areas: Area[];
  public onEvent: Subject<ContractServerWebSocketMessage>;
  public settings: GameSettings;
  public items: Item[];
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
    maximumAmountOfHeroes: number
  ) {
    this.dbModel = dbModel;
    this.settings = settings;
    this.heroes = heroes;
    this.completedAreaTypes = completedAreaTypes;
    this.areas = areas;
    this.items = items;
    this.maximumAmountOfHeroes = maximumAmountOfHeroes;
    this.availableAreaTypes = this.calculateAvailableAreaTypes();

    this.onEvent = new Subject();

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
  
  public getNextAbilityId(): number {
    return this.dbModel.state.nextAbilityId++;
  }
  
  public getNextItemId(): number {
    return this.dbModel.state.nextItemId++;
  }

  public addHero(hero: Hero): void {
    this.dbModel.state.heroes.push(hero.dbModel);
    this.heroes.push(hero);

    this.setUpEventListenersForHero(hero);
    this.onEvent.next(new ContractHeroAddedMessage(hero.toContractModel()));
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
      maximumAmountOfHeroes: this.maximumAmountOfHeroes
    };
  }

  private calculateAvailableAreaTypes(): AreaType[] {
    const firstAreaType = StaticGameContentService.instance.getAreaType('basic-forest');
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

    const maximumAmountOfHeroes = 6;

    const game = new Game(
      dbModel,
      settings,
      heroes,
      completedAreaTypes,
      areas,
      items,
      maximumAmountOfHeroes
    );
    return game;
  }
}
