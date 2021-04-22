import { Subject } from "rxjs";
import { ContractWebSocketMessage } from "src/loot-hoarder-contract/contract-web-socket-message";
import { DbArea } from "src/raw-game-state/db-area";
import { StaticGameContentService } from "src/services/static-game-content-service";
import { UIArea } from "src/ui-game-state/ui-area";
import { AreaHero } from "./area-hero";
import { AreaType } from "./area-type";
import { Combat } from "./combat";

export class Area {
  public dbModel: DbArea;
  public type: AreaType;
  public heroes: AreaHero[];
  public currentCombat: Combat;
  public onEvent: Subject<ContractWebSocketMessage>;

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
    this.onEvent = new Subject();

    this.setUpEventListeners();
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

  private setUpEventListeners(): void {
    this.setUpEventListenersForCombat(this.currentCombat);
  }

  private setUpEventListenersForCombat(combat: Combat): void {
    combat.onCombatEvent.subscribe(event => 
      this.onEvent.next(event));
  }

  public static load(dbModel: DbArea, staticContent: StaticGameContentService): Area {
    const areaType = staticContent.getAreaType(dbModel.typeKey);
    const areaHeroes = dbModel.heroes.map(dbHero => AreaHero.load(dbHero, staticContent));
    const currentCombat = Combat.load(dbModel.currentCombat);
    const area = new Area(dbModel, areaType, areaHeroes, currentCombat);
    return area;
  }
}
