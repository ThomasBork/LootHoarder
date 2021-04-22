import { Injectable } from "@nestjs/common";
import AbilityTypeEffectTypes from "src/loot-hoarder-static-content/ability-type-effect-types.json";
import AbilityTypes from "src/loot-hoarder-static-content/ability-types.json";
import AreaTypes from "src/loot-hoarder-static-content/area-types.json";
import AreaTypeTransitions from "src/loot-hoarder-static-content/area-type-transitions.json";
import HeroTypes from "src/loot-hoarder-static-content/hero-types.json";
import { AreaType } from "src/computed-game-state/area/area-type";
import { AbilityType } from "src/computed-game-state/ability-type";
import { HeroType } from "src/computed-game-state/hero-type";
import { AttributeSet } from "src/computed-game-state/attribute-set";
import { AbilityTypeEffectType } from "src/computed-game-state/ability-type-effect-type";
import { AbilityTypeEffect } from "src/computed-game-state/ability-type-effect";
import { AbilityTargetScheme } from "src/computed-game-state/ability-target-scheme";

@Injectable()
export class StaticGameContentService {
  private abilityTypeEffectTypes!: AbilityTypeEffectType[];
  private abilityTypes!: AbilityType[];
  private heroTypes!: HeroType[];
  private areaTypes!: AreaType[];

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

  private loadAssets(): void {
    this.loadAbilityTypeEffectTypes();
    this.loadAbilityTypes();
    this.loadHeroTypes();
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

  private loadHeroTypes(): void {
    this.heroTypes = HeroTypes.map(heroType => 
      {
        const baseAttributes = new AttributeSet(heroType.baseAttributes);
        const attributesPerLevel = new AttributeSet(heroType.attributesPerLevel);
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

  private loadAreaTypes(): void {
    this.areaTypes = AreaTypes.map(a => new AreaType(
      a.key,
      a.name,
      a.description,
      a.level
    ));

    for(let transition of AreaTypeTransitions) {
      const areaType1 = this.getAreaType(transition[0]);
      const areaType2 = this.getAreaType(transition[1]);
      areaType1.adjacentAreaTypes.push(areaType2);
      areaType2.adjacentAreaTypes.push(areaType1);
    }
  }
}