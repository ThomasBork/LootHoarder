import { Subject } from 'rxjs';
import { ContractAreaCreatedMessage } from 'src/loot-hoarder-contract/contract-area-created-message';
import { ContractHeroAddedMessage } from 'src/loot-hoarder-contract/contract-hero-added-message';
import { ContractServerWebSocketMessage } from 'src/loot-hoarder-contract/contract-server-web-socket-message';
import { DbGame } from 'src/raw-game-state/db-game';
import { StaticGameContentService } from 'src/services/static-game-content-service';
import { UIGame } from 'src/ui-game-state/ui-game';
import { Area } from './area/area';
import { AreaType } from './area/area-type';
import { Hero } from './hero';

export class Game {
  public heroes: Hero[];
  public completedAreaTypes!: AreaType[];
  public availableAreaTypes!: AreaType[];
  public areas: Area[];
  public onEvent: Subject<ContractServerWebSocketMessage>;
  
  private dbModel: DbGame;

  private constructor(
    dbModel: DbGame,
    heroes: Hero[],
    completedAreaTypes: AreaType[],
    availableAreaTypes: AreaType[],
    areas: Area[]
  ) {
    this.dbModel = dbModel;
    this.heroes = heroes;
    this.completedAreaTypes = completedAreaTypes;
    this.availableAreaTypes = availableAreaTypes;
    this.areas = areas;
    this.onEvent = new Subject();

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

  public addHero(hero: Hero): void {
    this.dbModel.state.heroes.push(hero.dbModel);
    this.heroes.push(hero);

    this.onEvent.next(new ContractHeroAddedMessage(hero.getUIState()));
  }

  public addArea(area: Area): void {
    this.dbModel.state.areas.push(area.dbModel);
    this.areas.push(area);
    
    this.setUpEventListenersForArea(area);
    this.onEvent.next(new ContractAreaCreatedMessage(area.getUIState()));
  }

  public findHero(heroId: number): Hero | undefined {
    return this.heroes.find(h => h.id === heroId);
  }

  public getUIState(): UIGame {
    return {
      id: this.id,
      createdAt: this.createdAt,
      heroes: this.heroes.map(h => h.getUIState()),
      areas: this.areas.map(a => a.getUIState()),
      availableAreaTypeKeys: this.availableAreaTypes.map(a => a.key),
      completedAreaTypeKeys: this.completedAreaTypes.map(a => a.key),
    };
  }

  private setUpEventListeners(): void {
    for(const area of this.areas) {
      this.setUpEventListenersForArea(area);
    }
  }

  private setUpEventListenersForArea(area: Area): void {
    area.onEvent.subscribe(event => this.onEvent.next(event));
  }

  public static load(dbModel: DbGame, staticContent: StaticGameContentService): Game {
    const heroes = dbModel.state.heroes.map(dbHero => Hero.load(dbHero, staticContent));
    const completedAreaTypes = dbModel.state.completedAreaTypes.map(cat => staticContent.getAreaType(cat));

    const firstAreaType = staticContent.getAreaType('basic-forest');
    const availableAreaTypes = completedAreaTypes
      .map(a => a.adjacentAreaTypes)
      .reduce((acc, x) => acc.concat(x), [])
      .concat(firstAreaType);
    const uniqueAvailableAreaTypes = [...new Set(availableAreaTypes)];

    const areas = dbModel.state.areas.map(dbArea => Area.load(dbArea, staticContent));

    const game = new Game(
      dbModel,
      heroes,
      completedAreaTypes,
      uniqueAvailableAreaTypes,
      areas
    );
    return game;
  }
}
