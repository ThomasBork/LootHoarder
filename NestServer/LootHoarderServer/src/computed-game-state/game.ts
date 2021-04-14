import { DbGame } from 'src/raw-game-state/db-game';
import { AreaType } from 'src/static-game-content/area-type';
import { StaticGameContentService } from 'src/static-game-content/static-game-content-service';
import { UIGame } from 'src/ui-game-state/ui-game';
import { Area } from './area/area';
import { Hero } from './hero';

export class Game {
  public heroes: Hero[];
  public completedAreaTypes!: AreaType[];
  public availableAreaTypes!: AreaType[];
  public areas: Area[];
  
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

  public addHero(hero: Hero): void {
    this.dbModel.state.heroes.push(hero.dbModel);
    this.heroes.push(hero);
  }

  public addArea(area: Area): void {
    this.dbModel.state.areas.push(area.dbModel);
    this.areas.push(area);
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

  public static load(dbModel: DbGame, staticContent: StaticGameContentService): Game {
    const heroes = dbModel.state.heroes.map(Hero.load);
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
