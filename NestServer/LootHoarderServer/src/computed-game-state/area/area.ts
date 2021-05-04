import { Subject, Subscription } from "rxjs";
import { ContractArea } from "src/loot-hoarder-contract/contract-area";
import { ContractCombatStartedMessage } from "src/loot-hoarder-contract/server-actions/contract-combat-started-message";
import { ContractCombatWebSocketMessage } from "src/loot-hoarder-contract/server-actions/contract-combat-web-socket-message";
import { ContractServerWebSocketMessage } from "src/loot-hoarder-contract/server-actions/contract-server-web-socket-message";
import { DbArea } from "src/raw-game-state/db-area";
import { StaticGameContentService } from "src/services/static-game-content-service";
import { AreaHero } from "./area-hero";
import { AreaType } from "./area-type";
import { Combat } from "./combat";

export class Area {
  public dbModel: DbArea;
  public type: AreaType;
  public heroes: AreaHero[];
  public currentCombat: Combat;
  public onEvent: Subject<ContractServerWebSocketMessage>;
  public onAreaComplete: Subject<boolean>;

  private combatEventListeners: Subscription[];

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
    this.onAreaComplete = new Subject();
    this.combatEventListeners = [];

    this.setUpEventListeners();
  }

  public get id(): number { return this.dbModel.id; }

  public get currentCombatNumber(): number { return this.dbModel.currentCombatNumber; }
  public set currentCombatNumber(newValue: number) { this.dbModel.currentCombatNumber = newValue; }
  public get totalAmountOfCombats(): number { return this.dbModel.totalAmountOfCombats; }

  public startNewCurrentCombat(combat: Combat): void {
    this.currentCombatNumber++;
    this.dbModel.currentCombat = combat.dbModel;
    this.currentCombat = combat;
    this.setUpEventListenersForCombat(combat);
    const message = new ContractCombatStartedMessage(this.id, combat.getUIState(), this.currentCombatNumber);
    this.onEvent.next(message);
  }

  public getUIState(): ContractArea {
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
    this.combatEventListeners.forEach(listener => listener.unsubscribe());

    const eventListeners = [
      combat.onCombatEvent.subscribe(event => 
        this.onEvent.next(new ContractCombatWebSocketMessage(combat.id, event))
      ),
      combat.onCombatEnded.subscribe(() => this.handleCombatEnded(combat))
    ];
    this.combatEventListeners = eventListeners;
  }

  private handleCombatEnded(combat: Combat): void {
    const winningTeam = combat.didTeam1Win ? combat.team1 : combat.team2;
    const losingTeam = combat.didTeam1Win ? combat.team2 : combat.team1;
    for(const winningCharacter of winningTeam) {
      const areaHero = this.heroes.find(h => h.combatCharacter.id === winningCharacter.id);
      if (areaHero) {
        const totalExperience = losingTeam
          .map(losingCharacter => 40 + this.type.level * 10)
          .reduce((exp1, exp2) => exp1 + exp2, 0);
        areaHero.hero.giveExperience(totalExperience);
      }
    }
    if (this.currentCombatNumber === this.totalAmountOfCombats) {
      if (this.currentCombat.didTeam1Win) {
        this.onAreaComplete.next();
      }
    }
  }

  public static load(dbModel: DbArea): Area {
    const areaType = StaticGameContentService.instance.getAreaType(dbModel.typeKey);
    const currentCombat = Combat.load(dbModel.currentCombat);
    const allCombatCharacters = [...currentCombat.team1, ...currentCombat.team2];
    const areaHeroes = dbModel.heroes.map(dbHero => {
      const combatCharacter = allCombatCharacters.find(c => c.id === dbHero.combatCharacterId);
      if (!combatCharacter) {
        throw Error (`Combat character with id: ${dbHero.combatCharacterId} is not in this combat.`);
      }
      return AreaHero.load(dbHero, combatCharacter);
    });
    const area = new Area(dbModel, areaType, areaHeroes, currentCombat);
    return area;
  }
}
