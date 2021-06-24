import { Injectable } from "@angular/core";
import { AbilityType } from "./ability-type";
import { HeroType } from "./hero-type";
import HeroTypes from 'src/loot-hoarder-static-content/hero-types.json';
import MonsterTypes from 'src/loot-hoarder-static-content/monster-types.json';
import AbilityTypeEffectTypes from 'src/loot-hoarder-static-content/ability-type-effect-types.json';
import AbilityTypes from 'src/loot-hoarder-static-content/ability-types.json';
import AreaTypes from 'src/loot-hoarder-static-content/area-types.json';
import AreaTypeTransitions from 'src/loot-hoarder-static-content/area-type-transitions.json';
import ItemTypes from 'src/loot-hoarder-static-content/item-types.json';
import PassiveAbilityTypes from 'src/loot-hoarder-static-content/passive-ability-types.json';
import ContinuousEffectTypes from 'src/loot-hoarder-static-content/continuous-effect-types.json';
import HeroSkillTreeJson from 'src/loot-hoarder-static-content/hero-skill-tree.json';
import QuestRewardTypes from "src/loot-hoarder-static-content/quest-reward-types.json";
import QuestTypes from "src/loot-hoarder-static-content/quest-types.json";
import AchievementTypes from "src/loot-hoarder-static-content/achievement-types.json";
import { AreaType } from "./area-type";
import { ItemType } from "./item-type";
import { ContractItemCategory } from "src/loot-hoarder-contract/contract-item-category";
import { PassiveAbilityType } from "./passive-ability-type";
import { HeroSkillTree } from "./hero-skill-tree";
import { SkillTreeTransition } from "./skill-tree-transition";
import { HeroSkillTreeNode } from "./hero-skill-tree-node";
import { HeroSkillTreeStartingNode } from "./hero-skill-tree-starting-node";
import { ContinuousEffectType } from "./continuous-effect-type";
import { AbilityTypeEffectApplyContinuousEffectParameters } from "./ability-type-effect-apply-continuous-effect-parameters";
import { AbilityTypeEffectApplyContinuousEffect } from "./ability-type-effect-apply-continuous-effect";
import { AbilityTypeEffectDealDamage } from "./ability-type-effect-deal-damage";
import { AbilityTypeEffectDealDamageParameters } from "./ability-type-effect-deal-damage-parameters";
import { AbilityTypeEffectType } from "./ability-type-effect-type";
import { ContinuousEffectTypeAbilityRecipe } from "./continuous-effect-type-ability-recipe";
import { ContractPassiveAbilityTypeKey } from "src/loot-hoarder-contract/contract-passive-ability-type-key";
import { PassiveAbilityAttribute } from "./passive-ability-attribute";
import { PassiveAbilityUnlockAbility } from "./passive-ability-unlock-ability";
import { PassiveAbilityTakeDamageOverTime } from "./passive-ability-take-damage-over-time";
import { MonsterType } from "./monster-type";
import { AccomplishmentTypeDefeatSpecificMonsterType } from "./accomplishment-type-defeat-specific-monster-type";
import { AccomplishmentTypeFullInventory } from "./accomplishment-type-full-inventory";
import { AccomplishmentTypeDefeatMonsters } from "./accomplishment-type-defeat-monsters";
import { AccomplishmentTypeCompleteSpecificAreaType } from "./accomplishment-type-complete-specific-area-type";
import { QuestRewardType } from "./quest-reward-type";
import { QuestType } from "./quest-type";
import { AchievementType } from "./achievement-type";
import { AccomplishmentType } from "./accomplishment-type";
import { QuestReward } from "./quest-reward";
import { ContractGameTabKey } from "src/loot-hoarder-contract/contract-game-tab-key";
import { QuestRewardUnlockTab } from "./quest-reward-unlock-tab";
import { QuestRewardHeroSlot } from "./quest-reward-hero-slot";

@Injectable()
export class AssetManagerService {
  private abilityTypeEffectTypes!: AbilityTypeEffectType[];
  private abilityTypes: AbilityType[] = [];
  private heroTypes: HeroType[] = [];
  private monsterTypes: MonsterType[] = [];
  private areaTypes: AreaType[] = [];
  private itemTypes!: ItemType[];
  private passiveAbilityTypes!: PassiveAbilityType[];
  private heroSkillTree!: HeroSkillTree;
  private continuousEffectTypes!: ContinuousEffectType[];
  private questRewardTypes!: QuestRewardType[];
  private questTypes!: QuestType[];
  private achievementTypes!: AchievementType[];

  private static _instance?: AssetManagerService;
  public constructor() {
    AssetManagerService._instance = this;
  }

  public static get instance(): AssetManagerService {
    if (!AssetManagerService._instance) {
      throw Error ('Cannot get instance of the AssetManagerService before an instance has been constructed.');
    }

    return AssetManagerService._instance;
  }

  public loadAssets(): void {
    this.loadPassiveAbilityTypes();
    this.loadContinuousEffectTypes();
    this.loadAbilityTypeEffectTypes();
    this.loadAbilityTypes();
    this.loadItemTypes();
    this.loadHeroTypes();
    this.loadMonsterTypes();
    this.loadAreaTypes();
    this.loadHeroSkillTree();
    this.loadQuestRewardTypes();
    this.loadQuestTypes();
    this.loadAchievementTypes();
  }

  public getAbilityTypeEffectType(key: string): AbilityTypeEffectType {
    const result = this.abilityTypeEffectTypes.find(x => x.key === key);
    if (!result) {
      throw Error (`Ability type effect type with key = '${key}' not found.`);
    }
    return result;
  }

  public getAbilityType(key: string): AbilityType {
    const result = this.abilityTypes.find(x => x.key === key);
    if (!result) {
      throw Error (`Ability type with key = '${key}' not found.`);
    }
    return result;
  }

  public getAllAbilityTypes(): AbilityType[] {
    return [...this.abilityTypes];
  }

  public getHeroType(key: string): HeroType {
    const result = this.heroTypes.find(x => x.key === key);
    if (!result) {
      throw Error (`Hero type with key = '${key}' not found.`);
    }
    return result;
  }

  public getAllHeroTypes(): HeroType[] {
    return [...this.heroTypes];
  }

  public getMonsterType(key: string): MonsterType {
    const result = this.monsterTypes.find(x => x.key === key);
    if (!result) {
      throw Error (`Monster type with key = '${key}' not found.`);
    }
    return result;
  }

  public getHeroSkillTree(): HeroSkillTree {
    return this.heroSkillTree;
  }

  public getAreaType(key: string): AreaType {
    const areaType = this.areaTypes.find(x => x.key === key);
    if (!areaType) {
      throw Error (`Area type '${key}' not found.`);
    }
    return areaType;
  }

  public getAllAreaTypes(): AreaType[] {
    return [...this.areaTypes];
  }

  public getPassiveAbilityType(key: string): PassiveAbilityType {
    const passiveAbilityType = this.passiveAbilityTypes.find(x => x.key === key);
    if (!passiveAbilityType) {
      throw Error (`Item ability type '${key}' not found.`);
    }
    return passiveAbilityType;
  }

  public getItemType(key: string): ItemType {
    const itemType = this.itemTypes.find(x => x.key === key);
    if (!itemType) {
      throw Error (`Item type '${key}' not found.`);
    }
    return itemType;
  }

  public getContinuousEffectType(key: string): ContinuousEffectType {
    const continuousEffectType = this.continuousEffectTypes.find(x => x.key === key);
    if (!continuousEffectType) {
      throw Error (`Continuous effect type '${key}' not found.`);
    }
    return continuousEffectType;
  }

  public getQuestRewardType(key: string): QuestRewardType {
    const result = this.questRewardTypes.find(x => x.key === key);
    if (!result) {
      throw Error (`Quest reward type with key = '${key}' not found.`);
    }
    return result;
  }

  public getAllQuestTypes(): QuestType[] {
    return this.questTypes;
  }

  public getAllAchievementTypes(): AchievementType[] {
    return this.achievementTypes;
  }

  private loadContinuousEffectTypes(): void {
    this.continuousEffectTypes = ContinuousEffectTypes.map(continuousEffectType => 
      new ContinuousEffectType(
        continuousEffectType.key,
        continuousEffectType.name,
        continuousEffectType.isUnique,
        (continuousEffectType.abilities as any).map((ability: any) => 
          new ContinuousEffectTypeAbilityRecipe(
            this.getPassiveAbilityType(ability.typeKey),
            ability.parameters
          )
        )
      )
    );
  }

  private loadAbilityTypeEffectTypes(): void {
    this.abilityTypeEffectTypes = AbilityTypeEffectTypes.map(effectType => 
      new AbilityTypeEffectType(
        effectType.key,
        effectType.parameters
      )
    );
  }

  private loadAbilityTypes(): void {
    this.abilityTypes = AbilityTypes.map(abilityType => {
      const effects = (abilityType.effects as any).map((effect: any) => {
        const effectType = this.getAbilityTypeEffectType(effect.key);
        for(const parameterKey of effectType.parameters) {
          if (!effect.parameters.hasOwnProperty(parameterKey)) {
            throw Error (`The ability type, '${abilityType.key}', has an effect of the type, '${effect.key}', that does not have the required parameter: '${parameterKey}'.`);
          }
        }
        const tags = [...new Set([...effect.tags, ...abilityType.inheritedTags])];
        const target = effect.target;
        switch(effect.key) {
          case 'deal-damage': {
            const parameters = new AbilityTypeEffectDealDamageParameters(effect.parameters.baseAmount);
            return new AbilityTypeEffectDealDamage(
              effectType,
              tags,
              target,
              parameters
            );
          }
          case 'apply-continuous-effect': {
            const continuousEffectType = this.getContinuousEffectType(effect.parameters.continuousEffectTypeKey);
            const duration = effect.parameters.duration;
            const additionalAbilityParameters = effect.parameters.abilityParameters;
            const parameters = new AbilityTypeEffectApplyContinuousEffectParameters(
              continuousEffectType,
              duration,
              additionalAbilityParameters
            );
            return new AbilityTypeEffectApplyContinuousEffect(
              effectType,
              tags,
              target,
              parameters
            );
          }
          default:
            throw Error (`The ability type effect has no implementation.`);
        }
      });

      return new AbilityType(
        abilityType.key, 
        abilityType.name, 
        abilityType.description, 
        abilityType.tags,
        effects
      );
    });
  }

  private loadHeroTypes(): void {
    this.heroTypes = HeroTypes.map(heroType => 
      new HeroType(
        heroType.key,
        heroType.name,
        heroType.description,
        heroType.abilityTypes.map(abilityTypeKey => this.getAbilityType(abilityTypeKey)),
        this.getItemType(heroType.startingWeaponType)
      )
    );
  }

  private loadMonsterTypes(): void {
    this.monsterTypes = MonsterTypes.map(monsterType => 
      new MonsterType(
        monsterType.key,
        monsterType.name
      )
    );
  }

  private loadAreaTypes(): void {
    this.areaTypes = AreaTypes.map(a => new AreaType(
      a.key,
      a.name,
      a.description,
      a.level,
      a.x,
      a.y
    ));

    for(let transition of AreaTypeTransitions) {
      const areaType1 = this.getAreaType(transition[0]);
      const areaType2 = this.getAreaType(transition[1]);
      areaType1.adjacentAreaTypes.push(areaType2);
      areaType2.adjacentAreaTypes.push(areaType1);
    }
  }

  private loadItemTypes(): void {
    this.itemTypes = ItemTypes.map(itemType => new ItemType(
      itemType.key,
      itemType.name,
      itemType.category as ContractItemCategory,
      itemType.image.fixtureLeft,
      itemType.image.fixtureTop,
      itemType.image.widthInPercent,
    ));
  }

  private loadPassiveAbilityTypes(): void {
    this.passiveAbilityTypes = PassiveAbilityTypes.map(passiveAbilityType => new PassiveAbilityType(
      passiveAbilityType.key as ContractPassiveAbilityTypeKey,
      passiveAbilityType.parameters
    ));
  }

  private loadHeroSkillTree(): void {
    const nodes = HeroSkillTreeJson.nodes.map(node => {
      const startNodeAbility = (node.abilities as any).find((ability: any) => ability.typeKey === 'heroTypeStartPosition');
      
      if (startNodeAbility) {
        if (!startNodeAbility.data.heroTypeKey) {
          throw Error (`Starting node at position (${node.x}, ${node.y}) has no hero type key.`);
        }

        const heroType = this.getHeroType(startNodeAbility.data.heroTypeKey);

        const newNode = new HeroSkillTreeStartingNode(
          node.x,
          node.y,
          heroType
        );

        heroType.heroSkillTreeStartingNode = newNode;

        return newNode;
      }
      
      const abilities = (node.abilities as any)
        .map((ability: any) => {
          const abilityType = this.getPassiveAbilityType(ability.typeKey);
          switch(ability.typeKey) {
            case ContractPassiveAbilityTypeKey.attribute:
              return new PassiveAbilityAttribute(abilityType, ability.data);
            case ContractPassiveAbilityTypeKey.takeDamageOverTime:
              return new PassiveAbilityTakeDamageOverTime(abilityType, ability.data, ability.data.damagePerSecond);
            case ContractPassiveAbilityTypeKey.unlockAbility:
              return new PassiveAbilityUnlockAbility(abilityType, ability.data);
            default: 
              throw Error (`Unhandled ability type: ${ability.typeKey}`);
          }
        });

      return new HeroSkillTreeNode(node.x, node.y, node.size, abilities);
    });

    const transitions = HeroSkillTreeJson.transitions
      .map(transition => new SkillTreeTransition(transition.fromX, transition.fromY, transition.toX, transition.toY));

    this.heroSkillTree = new HeroSkillTree(nodes, transitions);
  }

  private loadQuestRewardTypes(): void {
    this.questRewardTypes = QuestRewardTypes.map(questRewardType => 
      new QuestRewardType(questRewardType.typeKey, questRewardType.requiredParameters)
    );
  }

  private loadQuestTypes(): void {
    const questTypes = QuestTypes.map(questType => {
      const key = questType.key;
      const name = questType.name;
      const requiredAccomplishmentTypes = questType.requiredAccomplishments.map(requiredAccomplishment =>
        this.buildAccomplishmentType(
          requiredAccomplishment.typeKey,
          requiredAccomplishment.parameters,
          requiredAccomplishment.requiredAmount
        )
      );
      const rewards = (questType.rewards as any[]).map(reward => 
        this.buildQuestReward(reward.typeKey, reward.parameters)
      );
      const hiddenRewards = (questType.hiddenRewards as any[]).map(reward => 
        this.buildQuestReward(reward.typeKey, reward.parameters)
      );

      return new QuestType (
        key,
        name,
        requiredAccomplishmentTypes,
        rewards,
        hiddenRewards
      );
    });

    for(const jsonQuestType of QuestTypes) {
      if (jsonQuestType.previousQuestKey) {
        const questType = questTypes.find(q => q.key === jsonQuestType.key);
        if (!questType) {
          throw Error (`Could not find the quest type with key: ${jsonQuestType.key}`);
        }
        const previousQuestType = questTypes.find(q => q.key === jsonQuestType.previousQuestKey);
        if (!previousQuestType) {
          throw Error (`Could not find the quest type with key: ${jsonQuestType.previousQuestKey}`);
        }
        questType.previousQuestType = previousQuestType;
      }
    }

    this.questTypes = questTypes;
  }

  private loadAchievementTypes(): void {
    this.achievementTypes = AchievementTypes.map(achievementType => {
      const key = achievementType.key;
      const name = achievementType.name;
      const hideDescriptionUntilCompleted = achievementType.hideDescriptionUntilCompleted;
      const requiredAccomplishments = (achievementType.requiredAccomplishments as any[]).map(accomplishment => 
        this.buildAccomplishmentType(accomplishment.typeKey, accomplishment.parameters, accomplishment.requiredAmount)
      );
      return new AchievementType(
        key,
        name,
        hideDescriptionUntilCompleted,
        requiredAccomplishments
      );
    });
  }

  private buildAccomplishmentType(typeKey: string, parameters: any, requiredAmount: number): AccomplishmentType {
    switch(typeKey) {
      case 'full-inventory': {
        return new AccomplishmentTypeFullInventory(requiredAmount);
      }
      case 'defeat-specific-monster-type': {
        const monsterTypeKey = parameters.monsterTypeKey as string;
        const monsterType = this.getMonsterType(monsterTypeKey);
        return new AccomplishmentTypeDefeatSpecificMonsterType(requiredAmount, monsterType);
      }
      case 'defeat-monsters': {
        return new AccomplishmentTypeDefeatMonsters(requiredAmount);
      }
      case 'complete-specific-area-type': {
        const areaTypeKey = parameters.areaTypeKey as string;
        const areaType = this.getAreaType(areaTypeKey);
        return new AccomplishmentTypeCompleteSpecificAreaType(requiredAmount, areaType);
      }
      default:
        throw Error (`Unhandled accomplishment type key: ${typeKey}`);
    }
  }

  private buildQuestReward(typeKey: string, parameters: any): QuestReward {
    const questRewardType = this.getQuestRewardType(typeKey);
    const requiredParameters = questRewardType.requiredParameters;
    for(const requiredParameterKey of requiredParameters) {
      if (!parameters.hasOwnProperty(requiredParameterKey)) {
        throw Error (`Expected quest reward type ${typeKey} to have the parameter ${requiredParameterKey}`);
      }
    }

    switch(typeKey) {
      case 'unlock-tab': {
        const parentTabKey = parameters.parentTabKey as ContractGameTabKey;
        const childTabKey = parameters.childTabKey as string | null;
        return new QuestRewardUnlockTab(questRewardType, parentTabKey, childTabKey ?? undefined);
      }
      case 'hero-slot': {
        return new QuestRewardHeroSlot(questRewardType);
      }
      default:
        throw Error (`Unhandled quest reward type key: ${typeKey}`);
    }
  }
}
