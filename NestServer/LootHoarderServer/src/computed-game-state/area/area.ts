import { Subject, Subscription } from "rxjs";
import { ContractArea } from "src/loot-hoarder-contract/contract-area";
import { ContractCombatStartedMessage } from "src/loot-hoarder-contract/server-actions/contract-combat-started-message";
import { ContractItemDroppedInAreaMessage } from "src/loot-hoarder-contract/server-actions/contract-item-dropped-in-area-message";
import { ContractCombatWebSocketMessage } from "src/loot-hoarder-contract/server-actions/contract-combat-web-socket-message";
import { ContractServerWebSocketMessage } from "src/loot-hoarder-contract/server-actions/contract-server-web-socket-message";
import { DbArea } from "src/raw-game-state/db-area";
import { ItemSpawnerService } from "src/services/item-spawner-service";
import { StaticGameContentService } from "src/services/static-game-content-service";
import { Item } from "../item";
import { AreaHero } from "./area-hero";
import { AreaType } from "./area-type";
import { Combat } from "./combat";
import { Loot } from "./loot";
import { GamesManager } from "src/services/games-manager";
import { ContractAttributeType } from "src/loot-hoarder-contract/contract-attribute-type";
import { Hero } from "../hero";

export class Area {
  public dbModel: DbArea;
  public type: AreaType;
  public heroes: AreaHero[];
  public currentCombat: Combat;
  public onEvent: Subject<ContractServerWebSocketMessage>;
  public onAreaComplete: Subject<boolean>;
  public onCombatComplete: Subject<Combat>;
  public loot: Loot;

  private combatEventListeners: Subscription[];

  private constructor(
    dbModel: DbArea, 
    type: AreaType, 
    heroes: AreaHero[],
    currentCombat: Combat,
    loot: Loot,
  ) {
    this.dbModel = dbModel;
    this.type = type;
    this.heroes = heroes;
    this.currentCombat = currentCombat;
    this.loot = loot;

    this.onEvent = new Subject();
    this.onAreaComplete = new Subject();
    this.onCombatComplete = new Subject();
    this.combatEventListeners = [];

    this.setUpEventListeners();
  }

  public get id(): number { return this.dbModel.id; }

  public get currentCombatNumber(): number { return this.dbModel.currentCombatNumber; }
  public set currentCombatNumber(newValue: number) { this.dbModel.currentCombatNumber = newValue; }
  public get totalAmountOfCombats(): number { return this.dbModel.totalAmountOfCombats; }
  public get hasMoreCombats(): boolean { return this.currentCombatNumber < this.totalAmountOfCombats; }

  public startNewCurrentCombat(combat: Combat): void {
    this.currentCombatNumber++;
    this.dbModel.currentCombat = combat.dbModel;
    this.currentCombat = combat;
    this.setUpEventListenersForCombat(combat);
    const message = new ContractCombatStartedMessage(this.id, combat.getUIState(), this.currentCombatNumber);
    this.onEvent.next(message);
  }

  public toContractModel(): ContractArea {
    return {
      id: this.dbModel.id,
      heroes: this.heroes.map(hero => hero.toContractModel()),
      typeKey: this.type.key,
      currentCombat: this.currentCombat.getUIState(),
      currentCombatNumber: this.dbModel.currentCombatNumber,
      totalAmountOfCombats: this.dbModel.totalAmountOfCombats,
      loot: this.loot.toContractModel()
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
        const experienceGiven = losingTeam
          .map(losingCharacter => 40 + this.type.level * 10)
          .reduce((exp1, exp2) => exp1 + exp2, 0);
        const experienceGainMultiplier = areaHero.hero.attributes.getAttribute(ContractAttributeType.experienceGain, []).valueContainer.value / 100;
        const experienceReceived = experienceGainMultiplier * experienceGiven;
        areaHero.hero.giveExperience(experienceReceived);
      }
    }
    if (combat.didTeam1Win) {
      const game = GamesManager.instance.getGameFromArea(this);
      const baseItemDropCount = 1;
      const itemDropCountMultiplier = this.heroes
        .map(areaHero => areaHero.hero.attributes.getAttribute(ContractAttributeType.itemDropChance, []).valueContainer.value / 100)
        .reduce((idc1, idc2) => idc1 * idc2, 1);
      const guaranteedItemDropCount = Math.floor(baseItemDropCount * itemDropCountMultiplier);
      const additionalDropChance = (baseItemDropCount * itemDropCountMultiplier) - guaranteedItemDropCount;
      const didAdditionalItemDrop = Math.random() < additionalDropChance;
      const actualItemDropCount = guaranteedItemDropCount + (didAdditionalItemDrop ? 1 : 0);
      const items: Item[] = [];
      for(let i = 0; i<actualItemDropCount; i++) {
        items.push(ItemSpawnerService.instance.spawnItem(game, this.type.level));
      }

      items.forEach(item => this.addItemToLoot(item));
    }
    this.onCombatComplete.next(combat);
    if (this.currentCombatNumber === this.totalAmountOfCombats) {
      if (this.currentCombat.didTeam1Win) {
        this.onAreaComplete.next();
      }
    }
  }

  private addItemToLoot(item: Item): void {
    this.dbModel.loot.items.push(item.dbModel);
    this.loot.items.push(item);
    this.onEvent.next(new ContractItemDroppedInAreaMessage(this.id, item.toContractModel()));
  }

  public static load(dbModel: DbArea, heroes: Hero[]): Area {
    const areaType = StaticGameContentService.instance.getAreaType(dbModel.typeKey);
    const currentCombat = Combat.load(dbModel.currentCombat);
    const allCombatCharacters = [...currentCombat.team1, ...currentCombat.team2];
    const areaHeroes = dbModel.heroes.map(dbAreaHero => {
      const combatCharacter = allCombatCharacters.find(c => c.id === dbAreaHero.combatCharacterId);
      if (!combatCharacter) {
        throw Error (`Combat character with id: ${dbAreaHero.combatCharacterId} is not in this combat.`);
      }
      const hero = heroes.find(h => h.id === dbAreaHero.heroId);
      if (!hero) {
        throw Error (`Hero not found. HeroId: ${dbAreaHero.heroId}`);
      }
      return AreaHero.load(dbAreaHero, combatCharacter, hero);
    });
    const loot = Loot.load(dbModel.loot);
    const area = new Area(dbModel, areaType, areaHeroes, currentCombat, loot);
    return area;
  }
}
