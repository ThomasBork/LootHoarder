import { Subject } from "rxjs";
import { ContractHero } from "src/loot-hoarder-contract/contract-hero";
import { ContractServerWebSocketMessage } from "src/loot-hoarder-contract/server-actions/contract-server-web-socket-message";
import { ContractHeroGainedExperienceMessage } from "src/loot-hoarder-contract/server-actions/contract-hero-gained-experience-message";
import { ContractHeroAttributeChangedMessage } from "src/loot-hoarder-contract/server-actions/contract-hero-attribute-changed-message";
import { ContractServerWebSocketMultimessage } from "src/loot-hoarder-contract/server-actions/contract-server-web-socket-multimessage";
import { DbHero } from "src/raw-game-state/db-hero";
import { StaticGameContentService } from "src/services/static-game-content-service";
import { AbilityType } from "./ability-type";
import { AttributeSet } from "./attribute-set";
import { HeroType } from "./hero-type";
import { EventStream } from "./message-bucket";

export class Hero {
  public dbModel: DbHero;
  public type: HeroType;
  public attributes: AttributeSet;
  public onLevelUp: Subject<number>;
  public onEvent: EventStream<ContractServerWebSocketMessage>;
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
    this.onEvent = new EventStream();
    this.abilityTypes = dbModel.abilityTypeKeys.map(key => StaticGameContentService.instance.getAbilityType(key));
    
    this.attributes.setAdditiveValueContainers(this.type.baseAttributes);

    const attributesFromLevel = new AttributeSet();
    attributesFromLevel.setAdditiveValueContainers(this.type.attributesPerLevel);
    attributesFromLevel.setMultiplicativeModifier(this, this.level);
    this.attributes.setAdditiveValueContainers(attributesFromLevel);
    this.onLevelUp.subscribe(newLevel => attributesFromLevel.setMultiplicativeModifier(this, newLevel));
    this.attributesFromLevel = attributesFromLevel;

    this.attributes.onChange.subscribe(change => this.onEvent.next(new ContractHeroAttributeChangedMessage(this.id, change.type, change.newValue)));
  }

  public get id(): number { return this.dbModel.id; }
  public get name(): string { return this.dbModel.name; }
  public get level(): number { return this.dbModel.level; }
  public get experience(): number { return this.dbModel.experience; }

  public giveExperience(experience: number): void {
    this.onEvent.setUpNewEventBucket();
    let experienceRequiredForNextLevel = this.getExperienceRequiredForNextLevel();
    this.dbModel.experience += experience;
    while(this.dbModel.experience > experienceRequiredForNextLevel) {
      this.dbModel.experience -= experienceRequiredForNextLevel;
      this.levelUp();
      experienceRequiredForNextLevel = this.getExperienceRequiredForNextLevel();
    }
    const innerMessages = this.onEvent.flushEventBucket();
    const experienceMessage = new ContractHeroGainedExperienceMessage(this.id, this.level, this.experience);
    const multimessage = new ContractServerWebSocketMultimessage([...innerMessages, experienceMessage]);
    this.onEvent.next(multimessage);
  }

  private levelUp(): void {
    this.dbModel.level++;
    this.onLevelUp.next(this.dbModel.level);
  }

  private getExperienceRequiredForNextLevel(): number {
    return Math.pow(this.level, 1.5) * 100;
  }

  public getUIState(): ContractHero {
    const attributes = this.attributes
      .getValues()
      .getUIState();
      
    return {
      id: this.id,
      typeKey: this.type.key,
      name: this.name,
      level: this.level,
      experience: this.experience,
      attributes: attributes
    };
  }

  public static load(dbModel: DbHero): Hero {
    const heroType = StaticGameContentService.instance.getHeroType(dbModel.typeKey);
    const attributes = new AttributeSet();
    const hero = new Hero(dbModel, heroType, attributes);
    return hero;
  }
}
