import { Injectable } from "@nestjs/common";
import AbilityTypeEffectTypes from "src/loot-hoarder-static-content/ability-type-effect-types.json";
import AbilityTypes from "src/loot-hoarder-static-content/ability-types.json";
import AreaTypes from "src/loot-hoarder-static-content/area-types.json";
import AreaTypeTransitions from "src/loot-hoarder-static-content/area-type-transitions.json";
import ContinuousEffectTypes from "src/loot-hoarder-static-content/continuous-effect-types.json";
import HeroTypes from "src/loot-hoarder-static-content/hero-types.json";
import MonsterTypes from "src/loot-hoarder-static-content/monster-types.json";
import PassiveAbilityTypes from "src/loot-hoarder-static-content/passive-ability-types.json";
import ItemTypes from "src/loot-hoarder-static-content/item-types.json";
import ItemAbilityRollRecipes from "src/loot-hoarder-static-content/item-ability-roll-recipes.json";
import HeroSkillTreeJson from "src/loot-hoarder-static-content/hero-skill-tree.json";
import { AreaType } from "src/computed-game-state/area/area-type";
import { AbilityType } from "src/computed-game-state/ability-type";
import { HeroType } from "src/computed-game-state/hero-type";
import { AttributeSet } from "src/computed-game-state/attribute-set";
import { AbilityTypeEffectType } from "src/computed-game-state/ability-type-effect-type";
import { WeightedElement } from "src/computed-game-state/weighted-element";
import { AreaTypeRepeatedEncounter } from "src/computed-game-state/area/area-type-repeated-encounter";
import { AreaTypeEncounterMonsterType } from "src/computed-game-state/area/area-type-encounter-monster-type";
import { MonsterType } from "src/computed-game-state/area/monster-type";
import { AreaTypeEncounter } from "src/computed-game-state/area/area-type-encounter";
import { CombinedAttributeValueContainer } from "src/computed-game-state/combined-attribute-value-container";
import { ContractAttributeType } from "src/loot-hoarder-contract/contract-attribute-type";
import { PassiveAbilityType } from "src/computed-game-state/passive-ability-type";
import { ItemType } from "src/computed-game-state/item-type";
import { ContractItemCategory } from "src/loot-hoarder-contract/contract-item-category";
import { ItemAbilityRecipe } from "src/computed-game-state/item-ability-recipe";
import { ItemAbilityRecipeParameters } from "src/computed-game-state/item-ability-recipe-parameters";
import { ValueRange } from "src/computed-game-state/value-range";
import { ItemAbilityRollRecipe } from "src/computed-game-state/item-ability-roll-recipe";
import { HeroSkillTree } from "src/computed-game-state/hero-skill-tree";
import { HeroSkillTreeNode } from "src/computed-game-state/hero-skill-tree-node";
import { PassiveAbility } from "src/computed-game-state/passive-ability";
import { HeroSkillTreeStartingNode } from "src/computed-game-state/hero-skill-tree-starting-node";
import { AbilityTypeEffectDealDamage } from "src/computed-game-state/ability-type-effect-deal-damage";
import { AbilityTypeEffectApplyContinuousEffect } from "src/computed-game-state/ability-type-effect-apply-continuous-effect";
import { ContinuousEffectType } from "src/computed-game-state/area/continuous-effect-type";
import { ContractPassiveAbilityTypeKey } from "src/loot-hoarder-contract/contract-passive-ability-type-key";
import { AbilityTypeEffectApplyContinuousEffectParameters } from "src/computed-game-state/ability-type-effect-apply-continuous-effect-parameters";
import { ContinuousEffectTypeAbilityRecipe } from "src/computed-game-state/area/continuous-effect-type-ability-recipe";
import { AttributeValueSet } from "src/computed-game-state/attribute-value-set";
import { AttributeValueContainer } from "src/computed-game-state/attribute-value-container";
import { PassiveAbilityLoader } from "src/computed-game-state/passive-ability-loader";

@Injectable()
export class StaticGameContentService {
  private abilityTypeEffectTypes!: AbilityTypeEffectType[];
  private abilityTypes!: AbilityType[];
  private heroSkillTree!: HeroSkillTree;
  private heroTypes!: HeroType[];
  private monsterTypes!: MonsterType[];
  private areaTypes!: AreaType[];
  private passiveAbilityTypes!: PassiveAbilityType[];
  private itemTypes!: ItemType[];
  private itemAbilityRollRecipes!: ItemAbilityRollRecipe[];
  private continuousEffectTypes!: ContinuousEffectType[];

  private static _instance: StaticGameContentService;

  public constructor(
  ) {
    StaticGameContentService._instance = this;
    this.loadAssets();
  }
  
  public static get instance(): StaticGameContentService {
    if (!StaticGameContentService._instance) {
      throw Error ('StaticGameContentService has not been instantiated.');
    }

    return StaticGameContentService._instance;
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

  public getPassiveAbilityType(key: string): PassiveAbilityType {
    const result = this.passiveAbilityTypes.find(x => x.key === key);
    if (!result) {
      throw Error (`Passive ability type with key = '${key}' not found.`);
    }
    return result;
  }

  public getContinuousEffectType(key: string): ContinuousEffectType {
    const result = this.continuousEffectTypes.find(x => x.key === key);
    if (!result) {
      throw Error (`Continuous effect type with key = '${key}' not found.`);
    }
    return result;
  }

  public getItemType(key: string): ItemType {
    const result = this.itemTypes.find(x => x.key === key);
    if (!result) {
      throw Error (`Item type with key = '${key}' not found.`);
    }
    return result;
  }

  public getAllItemTypes(filter?: (item: ItemType) => boolean): ItemType[] {
    if (!filter) {
      return [...this.itemTypes];
    }
    return this.itemTypes.filter(filter);
  }

  public getAreaType(key: string): AreaType {
    const areaType = this.areaTypes.find(x => x.key === key);
    if (!areaType) {
      throw Error (`Area type '${key}' not found.`);
    }
    return areaType;
  }

  public getHeroType(key: string): HeroType {
    const result = this.heroTypes.find(x => x.key === key);
    if (!result) {
      throw Error (`Hero type with key = '${key}' not found.`);
    }
    return result;
  }

  public getMonsterType(key: string): MonsterType {
    const result = this.monsterTypes.find(x => x.key === key);
    if (!result) {
      throw Error (`Monster type with key = '${key}' not found.`);
    }
    return result;
  }

  public getAllItemAbilityRollRecipes(filter?: (item: ItemAbilityRollRecipe) => boolean): ItemAbilityRollRecipe[] {
    if (!filter) {
      return [...this.itemAbilityRollRecipes];
    }
    return this.itemAbilityRollRecipes.filter(filter);
  }

  public getHeroSkillTree(): HeroSkillTree {
    return this.heroSkillTree;
  }

  private loadAssets(): void {
    this.loadPassiveAbilityTypes();
    this.loadContinuousEffectTypes();
    this.loadAbilityTypeEffectTypes();
    this.loadAbilityTypes();
    this.loadItemTypes();
    this.loadItemAbilityRollRecipes();
    this.loadHeroSkillTree();
    this.loadHeroTypes();
    this.loadMonsterTypes();
    this.loadAreaTypes();
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
    this.abilityTypes = AbilityTypes.map(abilityType => 
      new AbilityType(
        abilityType.key, 
        abilityType.name, 
        abilityType.description, 
        abilityType.tags,
        abilityType.inheritedTags,
        abilityType.manaCost,
        abilityType.timeToUse,
        abilityType.cooldown,
        abilityType.criticalStrikeChance,
        abilityType.effects.map((effect: any) => {
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
              const parameters = effect.parameters;
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
        })
      )
    );
  }

  private loadAttributeSetFromCoreAttributes(coreAttributes: {
    maximumHealth?: number;
    maximumMana?: number;
    attackPower?: number;
    spellPower?: number;
    attackUseSpeed?: number;
    spellUseSpeed?: number;
    attackCooldownSpeed?: number;
    spellCooldownSpeed?: number;
    physicalResistance?: number;
    elementalResistance?: number;
  }): AttributeValueSet {
    const attributeValueContainers: AttributeValueContainer[] = [];
    if (coreAttributes.maximumHealth) {
      attributeValueContainers.push(new AttributeValueContainer(ContractAttributeType.maximumHealth, [], coreAttributes.maximumHealth));
    }
    if (coreAttributes.maximumMana) {
      attributeValueContainers.push(new AttributeValueContainer(ContractAttributeType.maximumMana, [], coreAttributes.maximumMana));
    }
    if (coreAttributes.attackPower) {
      attributeValueContainers.push(new AttributeValueContainer(ContractAttributeType.power, ["attack"], coreAttributes.attackPower));
    }
    if (coreAttributes.spellPower) {
      attributeValueContainers.push(new AttributeValueContainer(ContractAttributeType.power, ["spell"], coreAttributes.spellPower));
    }
    if (coreAttributes.attackUseSpeed) {
      attributeValueContainers.push(new AttributeValueContainer(ContractAttributeType.useSpeed, ["attack"], coreAttributes.attackUseSpeed));
    }
    if (coreAttributes.spellUseSpeed) {
      attributeValueContainers.push(new AttributeValueContainer(ContractAttributeType.useSpeed, ["spell"], coreAttributes.spellUseSpeed));
    }
    if (coreAttributes.attackCooldownSpeed) {
      attributeValueContainers.push(new AttributeValueContainer(ContractAttributeType.cooldownSpeed, ["attack"], coreAttributes.attackCooldownSpeed));
    }
    if (coreAttributes.spellCooldownSpeed) {
      attributeValueContainers.push(new AttributeValueContainer(ContractAttributeType.cooldownSpeed, ["spell"], coreAttributes.spellCooldownSpeed));
    }
    if (coreAttributes.physicalResistance) {
      attributeValueContainers.push(new AttributeValueContainer(ContractAttributeType.resistance, ["physical"], coreAttributes.physicalResistance));
    }
    if (coreAttributes.elementalResistance) {
      attributeValueContainers.push(new AttributeValueContainer(ContractAttributeType.resistance, ["elemental"], coreAttributes.elementalResistance));
    }
    const attributeSet = new AttributeValueSet(attributeValueContainers);
    return attributeSet;
  }

  private loadHeroSkillTree(): void {
    const transitions = HeroSkillTreeJson.transitions;
    const nodes = HeroSkillTreeJson.nodes.map(node => {
      const startNodeAbility = (node.abilities as any).find((ability: any) => ability.typeKey === 'heroTypeStartPosition');
      if (startNodeAbility) {
        if (!startNodeAbility.data.heroTypeKey) {
          throw Error (`Starting node at position (${node.x}, ${node.y}) has no hero type key.`);
        }
        return new HeroSkillTreeStartingNode(
          node.x,
          node.y,
          startNodeAbility.data.heroTypeKey
        );
      }

      return new HeroSkillTreeNode(
        node.x, 
        node.y, 
        node.abilities.map((ability: any) => 
          PassiveAbilityLoader.loadAbility({
            typeKey: ability.typeKey,
            parameters: ability.data as any
          })
        )
      );
    });
    this.heroSkillTree = new HeroSkillTree(nodes);
    for(const transition of transitions) {
      const fromNode = this.heroSkillTree.getNode(transition.fromX, transition.fromY);
      const toNode = this.heroSkillTree.getNode(transition.toX, transition.toY);
      fromNode.addNeighborNode(toNode);
      toNode.addNeighborNode(fromNode);
    }
  }

  private loadHeroTypes(): void {
    this.heroTypes = HeroTypes.map(heroType => 
      {
        const baseAttributes = this.loadAttributeSetFromCoreAttributes(heroType.baseAttributes);
        const attributesPerLevel = this.loadAttributeSetFromCoreAttributes(heroType.attributesPerLevel);
        const startItemType = this.getItemType(heroType.startingWeaponType);
        return new HeroType(
          heroType.key,
          heroType.name,
          heroType.description,
          heroType.abilityTypes.map(abilityTypeKey => this.getAbilityType(abilityTypeKey)),
          baseAttributes,
          attributesPerLevel,
          startItemType,
          this.heroSkillTree.getHeroTypeStartingPosition(heroType.key)
        );
      }
    )
  }

  private loadMonsterTypes(): void {
    this.monsterTypes = MonsterTypes.map(monsterType => 
      {
        const baseAttributes = this.loadAttributeSetFromCoreAttributes(monsterType.baseAttributes);
        const attributesPerLevel = this.loadAttributeSetFromCoreAttributes(monsterType.attributesPerLevel);
        return new MonsterType(
          monsterType.key,
          monsterType.name,
          monsterType.abilityTypes.map(abilityTypeKey => this.getAbilityType(abilityTypeKey)),
          baseAttributes,
          attributesPerLevel
        );
      }
    )
  }

  private loadAreaTypes(): void {
    this.areaTypes = AreaTypes.map(a => {
      const areaTypeRepeatedEncounters: AreaTypeRepeatedEncounter[] = [];
      for(const repeatedEncounter of a.repeatedEncounters) {
        const weightedEncounters = repeatedEncounter.encounters.map(e => 
          new WeightedElement<AreaTypeEncounter>(
            e.weight, 
            new AreaTypeEncounter(e.monsters.map(monster => {
              const monsterType = this.getMonsterType(monster.typeKey);
              return new AreaTypeEncounterMonsterType(monsterType);
            }))
          )
        );

        areaTypeRepeatedEncounters.push(new AreaTypeRepeatedEncounter(repeatedEncounter.repetitionAmount, weightedEncounters));
      }
      return new AreaType(
        a.key,
        a.name,
        a.description,
        a.level,
        areaTypeRepeatedEncounters
      );
    });

    for(let transition of AreaTypeTransitions) {
      const areaType1 = this.getAreaType(transition[0]);
      const areaType2 = this.getAreaType(transition[1]);
      areaType1.adjacentAreaTypes.push(areaType2);
      areaType2.adjacentAreaTypes.push(areaType1);
    }
  }

  private loadPassiveAbilityTypes(): void {
    this.passiveAbilityTypes = PassiveAbilityTypes.map(passiveAbilityType => 
      new PassiveAbilityType(passiveAbilityType.key as ContractPassiveAbilityTypeKey, passiveAbilityType.parameters));
  }

  private loadContinuousEffectTypes(): void {
    this.continuousEffectTypes = ContinuousEffectTypes.map(continuousEffectType => 
      new ContinuousEffectType(
        continuousEffectType.key,
        continuousEffectType.isUnique,
        continuousEffectType.abilities.map((ability: any) => 
          new ContinuousEffectTypeAbilityRecipe(
            this.getPassiveAbilityType(ability.typeKey),
            ability.parameters,
            ability.requiredDataParameters
          )
        )
      )
    );
  }

  private loadItemTypes(): void {
    this.itemTypes = ItemTypes.map(itemType => 
      new ItemType(
        itemType.key, 
        itemType.name,
        itemType.category as ContractItemCategory,
        itemType.innateAbilities.map(ability => {
          const itemAbilityType = this.getPassiveAbilityType(ability.typeKey);
          const typedParameters: ItemAbilityRecipeParameters = {};
          for(const key of Object.keys(ability.parameters)) {
            let value = (ability.parameters as any)[key];
            if (value.hasOwnProperty("min")) {
              value = new ValueRange(value.min, value.max, value.isInteger);
            }
            typedParameters[key] = value;
          }

          return new ItemAbilityRecipe(itemAbilityType, typedParameters);
        })
      )
    )
  }

  private loadItemAbilityRollRecipes(): void {
    this.itemAbilityRollRecipes = ItemAbilityRollRecipes.map(rollRecipe => {
      const typedParameters: ItemAbilityRecipeParameters = {};
      for(const key of Object.keys(rollRecipe.parameters)) {
        let value = (rollRecipe.parameters as any)[key];
        if (value && typeof value === 'object' && value.hasOwnProperty("min")) {
          value = new ValueRange(value.min, value.max, value.isInteger);
        }
        typedParameters[key] = value;
      }

      const itemAbilityType = this.getPassiveAbilityType(rollRecipe.typeKey);

      return new ItemAbilityRollRecipe(
        rollRecipe.itemCategories as ContractItemCategory[],
        rollRecipe.weight,
        new ItemAbilityRecipe(itemAbilityType, typedParameters)
      );
    });
  }
}