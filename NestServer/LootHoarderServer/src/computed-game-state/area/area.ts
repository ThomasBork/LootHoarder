import { DbArea } from "src/raw-game-state/db-area";
import { AreaType } from "src/static-game-content/area-type";
import { StaticGameContentService } from "src/static-game-content/static-game-content-service";
import { UIArea } from "src/ui-game-state/ui-area";
import { AreaHero } from "./area-hero";
import { Combat } from "./combat";

export class Area {
  public dbModel: DbArea;
  public type: AreaType;
  public heroes: AreaHero[];
  public currentCombat: Combat;

  private constructor(
    dbModel: DbArea, 
    type: AreaType, 
    heroes: AreaHero[],
    currentCombat: Combat
  ) {
    this.dbModel = dbModel;
    this.type = type;
    this.heroes = heroes;
    this.currentCombat = currentCombat;
  }

  public get id(): number { return this.dbModel.id; }

  public getUIState(): UIArea {
    return {
      id: this.dbModel.id,
      heroes: this.heroes.map(hero => hero.getUIState()),
      typeKey: this.type.key,
      currentCombat: this.currentCombat.getUIState(),
      currentCombatNumber: this.dbModel.currentCombatNumber,
      totalAmountOfCombats: this.dbModel.totalAmountOfCombats
    };
  }

  public static load(dbModel: DbArea, staticContent: StaticGameContentService): Area {
    const areaType = staticContent.getAreaType(dbModel.typeKey);
    const heroes = dbModel.heroes.map(dbHero => AreaHero.load(dbHero, staticContent));
    const currentCombat = Combat.load(dbModel.currentCombat);
    const area = new Area(dbModel, areaType, heroes, currentCombat);
    return area;
  }
}
