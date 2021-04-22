import { Subject } from "rxjs";
import { DbHero } from "src/raw-game-state/db-hero";
import { StaticGameContentService } from "src/services/static-game-content-service";
import { UIHero } from "src/ui-game-state/ui-hero";
import { AbilityType } from "./ability-type";
import { AttributeSet } from "./attribute-set";
import { HeroType } from "./hero-type";

export class Hero {
  public dbModel: DbHero;
  public type: HeroType;
  public attributes: AttributeSet;
  public onLevelUp: Subject<number>;
  public abilityTypes: AbilityType[];

  private attributesFromLevel: AttributeSet;

  private constructor(
    dbModel: DbHero,
    type: HeroType,
    attributes: AttributeSet
  ) {
    this.dbModel = dbModel;
    this.type = type;
    this.attributes = attributes;
    this.onLevelUp = new Subject();
    this.abilityTypes = dbModel.abilityTypeKeys.map(key => StaticGameContentService.instance.getAbilityType(key));
    
    this.attributes.setAdditiveValueContainers(this.type.baseAttributes);

    const attributesFromLevel = new AttributeSet();
    attributesFromLevel.setAdditiveValueContainers(this.type.attributesPerLevel);
    attributesFromLevel.setMultiplicativeModifier(this, this.level);
    this.attributes.setAdditiveValueContainers(attributesFromLevel);
    this.onLevelUp.subscribe(newLevel => attributesFromLevel.setMultiplicativeModifier(this, newLevel));
    this.attributesFromLevel = attributesFromLevel;
  }

  public get id(): number { return this.dbModel.id; }
  public get name(): string { return this.dbModel.name; }
  public get level(): number { return this.dbModel.level; }
  public get experience(): number { return this.dbModel.experience; }

  public getUIState(): UIHero {
    return {
      id: this.id,
      typeKey: this.type.key,
      name: this.name,
      level: this.level,
      experience: this.experience
    };
  }

  public static load(dbModel: DbHero, staticGameContentService: StaticGameContentService): Hero {
    const heroType = staticGameContentService.getHeroType(dbModel.typeKey);
    const attributes = new AttributeSet();
    const hero = new Hero(dbModel, heroType, attributes);
    return hero;
  }
}
