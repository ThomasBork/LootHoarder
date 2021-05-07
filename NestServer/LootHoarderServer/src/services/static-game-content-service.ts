import { Injectable } from "@nestjs/common";
import AbilityTypeEffectTypes from "src/loot-hoarder-static-content/ability-type-effect-types.json";
import AbilityTypes from "src/loot-hoarder-static-content/ability-types.json";
import AreaTypes from "src/loot-hoarder-static-content/area-types.json";
import AreaTypeTransitions from "src/loot-hoarder-static-content/area-type-transitions.json";
import HeroTypes from "src/loot-hoarder-static-content/hero-types.json";
import MonsterTypes from "src/loot-hoarder-static-content/monster-types.json";
import ItemAbilityTypes from "src/loot-hoarder-static-content/item-ability-types.json";
import ItemTypes from "src/loot-hoarder-static-content/item-types.json";
import { AreaType } from "src/computed-game-state/area/area-type";
import { AbilityType } from "src/computed-game-state/ability-type";
import { HeroType } from "src/computed-game-state/hero-type";
import { AttributeSet } from "src/computed-game-state/attribute-set";
import { AbilityTypeEffectType } from "src/computed-game-state/ability-type-effect-type";
import { AbilityTypeEffect } from "src/computed-game-state/ability-type-effect";
import { AbilityTargetScheme } from "src/computed-game-state/ability-target-scheme";
import { WeightedElement } from "src/computed-game-state/weighted-element";
import { AreaTypeRepeatedEncounter } from "src/computed-game-state/area/area-type-repeated-encounter";
import { AreaTypeEncounterMonsterType } from "src/computed-game-state/area/area-type-encounter-monster-type";
import { MonsterType } from "src/computed-game-state/area/monster-type";
import { AreaTypeEncounter } from "src/computed-game-state/area/area-type-encounter";
import { CombinedAttributeValueContainer } from "src/computed-game-state/combined-attribute-value-container";
import { ContractAttributeType } from "src/loot-hoarder-contract/contract-attribute-type";
import { ItemAbilityType } from "src/computed-game-state/item-ability-type";
import { ItemType } from "src/computed-game-state/item-type";
import { ContractItemCategory } from "src/loot-hoarder-contract/contract-item-category";
import { ItemAbilityRecipe } from "src/computed-game-state/item-ability-recipe";

@Injectable()
export class StaticGameContentService {
  private abilityTypeEffectTypes!: AbilityTypeEffectType[];
  private abilityTypes!: AbilityType[];
  private heroTypes!: HeroType[];
  private monsterTypes!: MonsterType[];
  private areaTypes!: AreaType[];
  private itemAbilityTypes!: ItemAbilityType[];
  private itemTypes!: ItemType[];

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

  public getItemAbilityType(key: string): ItemAbilityType {
    const result = this.itemAbilityTypes.find(x => x.key === key);
    if (!result) {
      throw Error (`Item ability type with key = '${key}' not found.`);
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

  private loadAssets(): void {
    this.loadAbilityTypeEffectTypes();
    this.loadAbilityTypes();
    this.loadHeroTypes();
    this.loadMonsterTypes();
    this.loadAreaTypes();
    this.loadItemAbilityTypes();
    this.loadItemTypes();
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
        abilityType.manaCost,
        abilityType.timeToUse,
        abilityType.cooldown,
        abilityType.criticalStrikeChance,
        abilityType.effects.map(effect => {
          const effectType = this.getAbilityTypeEffectType(effect.key);
          for(const parameterKey of effectType.parameters) {
            if (!effect.parameters.hasOwnProperty(parameterKey)) {
              throw Error (`The ability type, '${abilityType.key}', has an effect of the type, '${effect.key}', that does not have all parameters of that effect type.`);
            }
          }
          return new AbilityTypeEffect(
            effectType,
            effect.target as AbilityTargetScheme,
            effect.parameters
          )
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
    armor?: number;
    magicResistance?: number;
  }): AttributeSet {
    const combinedAttributes: CombinedAttributeValueContainer[] = [];
    if (coreAttributes.maximumHealth) {
      combinedAttributes.push(new CombinedAttributeValueContainer(ContractAttributeType.maximumHealth, undefined, coreAttributes.maximumHealth, 1));
    }
    if (coreAttributes.maximumMana) {
      combinedAttributes.push(new CombinedAttributeValueContainer(ContractAttributeType.maximumMana, undefined, coreAttributes.maximumMana, 1));
    }
    if (coreAttributes.attackPower) {
      combinedAttributes.push(new CombinedAttributeValueContainer(ContractAttributeType.power, "attack", coreAttributes.attackPower, 1));
    }
    if (coreAttributes.spellPower) {
      combinedAttributes.push(new CombinedAttributeValueContainer(ContractAttributeType.power, "spell", coreAttributes.spellPower, 1));
    }
    if (coreAttributes.attackUseSpeed) {
      combinedAttributes.push(new CombinedAttributeValueContainer(ContractAttributeType.useSpeed, "attack", coreAttributes.attackUseSpeed, 1));
    }
    if (coreAttributes.spellUseSpeed) {
      combinedAttributes.push(new CombinedAttributeValueContainer(ContractAttributeType.useSpeed, "spell", coreAttributes.spellUseSpeed, 1));
    }
    if (coreAttributes.attackCooldownSpeed) {
      combinedAttributes.push(new CombinedAttributeValueContainer(ContractAttributeType.cooldownSpeed, "attack", coreAttributes.attackCooldownSpeed, 1));
    }
    if (coreAttributes.spellCooldownSpeed) {
      combinedAttributes.push(new CombinedAttributeValueContainer(ContractAttributeType.cooldownSpeed, "spell", coreAttributes.spellCooldownSpeed, 1));
    }
    if (coreAttributes.armor) {
      combinedAttributes.push(new CombinedAttributeValueContainer(ContractAttributeType.armor, undefined, coreAttributes.armor, 1));
    }
    if (coreAttributes.magicResistance) {
      combinedAttributes.push(new CombinedAttributeValueContainer(ContractAttributeType.magicResistance, undefined, coreAttributes.magicResistance, 1));
    }
    const attributeSet = new AttributeSet(combinedAttributes);
    return attributeSet;
  }

  private loadHeroTypes(): void {
    this.heroTypes = HeroTypes.map(heroType => 
      {
        const baseAttributes = this.loadAttributeSetFromCoreAttributes(heroType.baseAttributes);
        const attributesPerLevel = this.loadAttributeSetFromCoreAttributes(heroType.attributesPerLevel);
        return new HeroType(
          heroType.key,
          heroType.name,
          heroType.description,
          heroType.abilityTypes.map(abilityTypeKey => this.getAbilityType(abilityTypeKey)),
          baseAttributes,
          attributesPerLevel
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

  private loadItemAbilityTypes(): void {
    this.itemAbilityTypes = ItemAbilityTypes.map(itemAbilityType => 
      new ItemAbilityType(itemAbilityType.key, itemAbilityType.parameters));
  }

  private loadItemTypes(): void {
    this.itemTypes = ItemTypes.map(itemType => 
      new ItemType(
        itemType.key, 
        itemType.name,
        itemType.category as ContractItemCategory,
        itemType.innateAbilities.map(ability => {
          const itemAbilityType = this.getItemAbilityType(ability.typeKey);
          return new ItemAbilityRecipe(itemAbilityType, ability.parameters);
        })
      )
    )
  }
}