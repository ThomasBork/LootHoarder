import { ContractServerChatMessageType } from "src/loot-hoarder-contract/server-actions/contract-server-chat-message-type";
import { Area } from "./area";
import { AreaType } from "./area-type";
import { ChatMessage } from "./chat-message";
import { Combat } from "./combat";
import { CombatTab } from "./combat-tab";
import { Game } from "./game";
import { GameTabName } from "./game-tab-name";
import { Hero } from "./hero";
import { HeroTab } from "./hero-tab";
import { SocialTab } from "./social-tab";
import { User } from "./user";
import { WorldTab } from "./world-tab";

export class UIState {
  public userId: number;
  public userName: string;

  public game: Game;
  public worldTab: WorldTab;
  public heroTab: HeroTab;
  public combatTab: CombatTab;
  public socialTab: SocialTab;

  public selectedTabName: GameTabName;

  public constructor(userId: number, userName: string, game: Game) {
    this.userId = userId;
    this.userName = userName;
    this.game = game;

    this.worldTab = new WorldTab();
    this.heroTab = new HeroTab();
    this.combatTab = new CombatTab();
    this.socialTab = new SocialTab();
    this.selectedTabName = game.heroes.length === 0 ? GameTabName.heroes : GameTabName.world;
    if (game.heroes.length === 1) {
      this.heroTab.selectedHero = game.heroes[0];
    }
  }

  public addHero(hero: Hero): void {
    this.game.heroes.push(hero);
    this.heroTab.selectedHero = hero;
  }

  public removeHero(heroId: number): void {
    const hero = this.game.getHero(heroId);
    if (this.heroTab.selectedHero === hero) {
      const heroIndex = this.game.heroes.indexOf(hero);
      if (heroIndex === this.game.heroes.length - 1) {
        this.heroTab.selectedHero = this.game.heroes[heroIndex - 1];
      } else {
        this.heroTab.selectedHero = this.game.heroes[heroIndex + 1];
      }
    }
    this.game.removeHero(hero);
  }

  public addArea(area: Area): void {
    const gameAreaType = this.game.allAreaTypes.find(areaType => area.type === areaType.type);
    if (!gameAreaType) {
      throw Error (`Area type ${area.type.key} was not found.`);
    }
    gameAreaType.areas.push(area);
    this.game.areas.push(area);
  }

  public removeArea(areaId: number): void {
    const area = this.game.getArea(areaId);
    for(const hero of this.game.heroes) {
      if (hero.areaHero && area.heroes.includes(hero.areaHero)) {
        hero.areaHero = undefined;
      }
    }

    for(const areaType of this.game.allAreaTypes) {
      const areaIndex = areaType.areas.indexOf(area);
      if (areaIndex >= 0) {
        areaType.areas.splice(areaIndex, 1);
      }
    }

    const areaIndex = this.game.areas.indexOf(area);
    if (areaIndex >= 0) {
      this.game.areas.splice(areaIndex, 1);
    }

    if (this.combatTab.selectedArea === area) {
      // If the area was the last area in the list
      if (this.game.areas.length === areaIndex) {
        this.combatTab.selectedArea = this.game.areas[this.game.areas.length - 1];
      } else {
        this.combatTab.selectedArea = this.game.areas[areaIndex];
      }
    }
  }

  public startCombat(area: Area, combat: Combat, combatNumber: number): void {
    area.changeCombat(combat, combatNumber, this.game.heroes);
  }

  public addCompletedAreaType(areaType: AreaType): void {
    this.game.completedAreaTypes.push(areaType);
    this.game.getGameAreaType(areaType.key).isCompleted = true;
  }

  public addAvailableAreaTypes(areaTypes: AreaType[]): void {
    this.game.availableAreaTypes.push(...areaTypes);
    for(const areaType of areaTypes) {
      this.game.getGameAreaType(areaType.key).isAvailable = true;
    }
  }

  public selectArea(area: Area): void {
    this.combatTab.selectedArea = area;
  }

  public selectTab(tabName: GameTabName): void {
    this.selectedTabName = tabName;

    if (tabName === GameTabName.social) {
      this.socialTab.chatMessages.forEach(message => message.isRead = true);
    }
  }

  public addChatMessage(chatMessage: ChatMessage): void {
    if (
      (
        this.userId === chatMessage.userId
        && chatMessage.messageType !== ContractServerChatMessageType.userAccomplishmentAnnouncement
      )
      || this.selectedTabName === GameTabName.social
      || this.game.settings.alwaysShowChat
    ) {
      chatMessage.isRead = true;
    }
    this.socialTab.chatMessages.push(chatMessage);
    if (chatMessage.messageType === ContractServerChatMessageType.userConnected) {
      const newUser = new User(chatMessage.userId, chatMessage.userName);
      this.socialTab.addConnectedUser(newUser);
    } else if (chatMessage.messageType === ContractServerChatMessageType.userDisconnected) {
      this.socialTab.removeConnectedUser(chatMessage.userId);
    }
  }

  public updateConnectedUsers(users: User[]): void {
    this.socialTab.connectedUsers = users;
  }
}
