import { ContractGameTabKey } from "src/loot-hoarder-contract/contract-game-tab-key";
import { ContractServerChatMessageType } from "src/loot-hoarder-contract/server-actions/contract-server-chat-message-type";
import { HeroTabChildTab } from "./hero-tab-child-tab";
import { Area } from "./area";
import { AreaType } from "./area-type";
import { ChatMessage } from "./chat-message";
import { Combat } from "./combat";
import { CombatTab } from "./combat-tab";
import { Game } from "./game";
import { Hero } from "./hero";
import { HeroTab } from "./hero-tab";
import { SocialTab } from "./social-tab";
import { User } from "./user";
import { WorldTab } from "./world-tab";
import { GameTab } from "./game-tab";
import { ItemsTab } from "./items-tab";
import { QuestsTab } from "./quests-tab";
import { AchievementsTab } from "./achievements-tab";
import { SettingsTab } from "./settings-tab";
import { QuestRewardUnlockTab } from "./quest-reward-unlock-tab";
import { Quest } from "./quest";
import { Achievement } from "./achievement";
import { WebSocketService } from "../../web-socket/web-socket.service";
import { CharacterBehavior } from "./character-behavior/character-behavior";
import { ContractUpdateHeroBehaviorMessage } from "src/loot-hoarder-contract/client-actions/contract-update-hero-behavior-message";

export class UIState {
  public userId: number;
  public userName: string;

  public game: Game;
  public worldTab: WorldTab;
  public heroesTab: HeroTab;
  public combatTab: CombatTab;
  public itemsTab: ItemsTab;
  public questsTab: QuestsTab;
  public achievementsTab: AchievementsTab;
  public settingsTab: SettingsTab;
  public socialTab: SocialTab;

  public selectedTab: GameTab;

  public allTabsAndChildTabs: GameTab[];

  public webSocketService: WebSocketService;

  public constructor(userId: number, userName: string, game: Game, webSocketService: WebSocketService) {
    this.userId = userId;
    this.userName = userName;
    this.game = game;

    this.webSocketService = webSocketService;

    this.worldTab = new WorldTab();
    this.heroesTab = new HeroTab();
    this.combatTab = new CombatTab();
    this.socialTab = new SocialTab();
    this.itemsTab = new ItemsTab();
    this.questsTab = new QuestsTab();
    this.achievementsTab = new AchievementsTab();
    this.settingsTab = new SettingsTab();

    this.allTabsAndChildTabs = [
      this.worldTab, 
      this.heroesTab,
      ...this.heroesTab.allTabs,
      this.combatTab,
      this.itemsTab,
      this.questsTab,
      this.achievementsTab,
      this.settingsTab,
      this.socialTab
    ];

    this.allTabsAndChildTabs.forEach(tab => tab.isEnabled = this.isTabEnabled(tab));

    for(const quest of game.quests) {
      for(const reward of quest.type.getAllRewards()) {
        if (reward instanceof QuestRewardUnlockTab) {
          reward.tab = this.getTab(reward.parentTabKey, reward.childTabKey);
        }
      }
    }

    this.worldTab.selectedAreaType = this.game.getGameAreaType('forest');

    this.selectedTab = game.heroes.length === 0 ? this.heroesTab : this.worldTab;
    if (game.heroes.length === 1) {
      this.heroesTab.selectedHero = game.heroes[0];
    }

    this.game.heroes.forEach(hero => 
      hero.behaviors.forEach(behavior => 
        behavior.onChange.subscribe(() => this.sendUpdateBehaviorMessage(hero, behavior))))
  }

  private sendUpdateBehaviorMessage(hero: Hero, behavior: CharacterBehavior): void {
    const message = new ContractUpdateHeroBehaviorMessage(hero.id, behavior.toContractModel());
    this.webSocketService.send(message);
  }

  public addBehaviorToHero(hero: Hero, behavior: CharacterBehavior): void {
    behavior.onChange.subscribe(() => this.sendUpdateBehaviorMessage(hero, behavior));
    hero.behaviors.push(behavior);
    if (
      hero.behaviors.length === 1 
      && this.selectedTab === this.heroesTab
      && this.heroesTab.selectedTab === this.heroesTab.behaviorsTab
      && this.heroesTab.selectedHero === hero
    ) {
      this.heroesTab.behaviorsTab.selectedBehavior = behavior;
    }
  }

  public addHero(hero: Hero): void {
    this.game.heroes.push(hero);
    this.heroesTab.selectedHero = hero;
  }

  public removeHero(heroId: number): void {
    const hero = this.game.getHero(heroId);
    if (this.heroesTab.selectedHero === hero) {
      const heroIndex = this.game.heroes.indexOf(hero);
      if (heroIndex === this.game.heroes.length - 1) {
        this.heroesTab.selectedHero = this.game.heroes[heroIndex - 1];
      } else {
        this.heroesTab.selectedHero = this.game.heroes[heroIndex + 1];
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
    if (!this.combatTab.selectedArea) {
      this.combatTab.selectedArea = area;
    }
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

  public addChatMessage(chatMessage: ChatMessage): void {
    if (
      (
        this.userId === chatMessage.userId
        && chatMessage.messageType !== ContractServerChatMessageType.userAccomplishmentAnnouncement
      )
      || this.selectedTab === this.socialTab
      || this.game.settings.alwaysShowChat
    ) {
      chatMessage.isRead = true;
    }
    this.socialTab.chatMessages.push(chatMessage);
    this.socialTab.updateNotificationAmount();
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

  public unlockTab(parentTabKey: ContractGameTabKey, childTabKey: string | undefined): void {
    const disabledGameTabIndex = this.game.disabledGameTabs.findIndex(tab => tab.parentTabKey === parentTabKey && tab.childTabKey === childTabKey);
    if (disabledGameTabIndex >= 0) {
      this.game.disabledGameTabs.splice(disabledGameTabIndex, 1);
    }
    const tab = this.getTab(parentTabKey, childTabKey);
    tab.isEnabled = true;
  }

  public selectTab(key: ContractGameTabKey): void {
    const tab = this.getTab(key, undefined);
    this.selectedTab = tab;
  }

  public getTab(parentTabKey: ContractGameTabKey, childTabKey: string | undefined): GameTab {
    const tab = this.allTabsAndChildTabs.find(tab =>
      (
        tab.parentTab
        && tab.parentTab.key === parentTabKey
        && tab.key === childTabKey
      )
      || (
        !childTabKey
        && tab.key === parentTabKey
      )
    );
    if (!tab) {
      throw Error (`Could not find tab: ${parentTabKey}, ${childTabKey}.`);
    }
    return tab;
  }

  public completeQuest(quest: Quest): void {
    quest.complete();
    for (const otherQuest of this.game.quests) {
      if (otherQuest.type.previousQuestType === quest.type) {
        otherQuest.isAvailable = true;
      }
    }
  }

  public completeAchievement(achievement: Achievement): void {
    achievement.complete();
  }

  private isTabEnabled(tab: GameTab): boolean {
    return !this.game.disabledGameTabs.some(disabledTab => 
      (
        tab.parentTab
        && disabledTab.parentTabKey === tab.parentTab.key
        && disabledTab.childTabKey === tab.key
      )
      ||
      (
        !disabledTab.childTabKey
        && disabledTab.parentTabKey === tab.key
      ) 
    );
  }
}
