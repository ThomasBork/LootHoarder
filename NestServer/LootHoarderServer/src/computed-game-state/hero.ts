import { Subject } from "rxjs";
import { ContractHero } from "src/loot-hoarder-contract/contract-hero";
import { ContractServerWebSocketMessage } from "src/loot-hoarder-contract/server-actions/contract-server-web-socket-message";
import { ContractHeroGainedExperienceMessage } from "src/loot-hoarder-contract/server-actions/contract-hero-gained-experience-message";
import { ContractHeroAttributeChangedMessage } from "src/loot-hoarder-contract/server-actions/contract-hero-attribute-changed-message";
import { ContractItemEquippedMessage } from "src/loot-hoarder-contract/server-actions/contract-item-equipped-message";
import { ContractItemUnequippedMessage } from "src/loot-hoarder-contract/server-actions/contract-item-unequipped-message";
import { ContractServerWebSocketMultimessage } from "src/loot-hoarder-contract/server-actions/contract-server-web-socket-multimessage";
import { DbHero } from "src/raw-game-state/db-hero";
import { StaticGameContentService } from "src/services/static-game-content-service";
import { AbilityType } from "./ability-type";
import { AttributeSet } from "./attribute-set";
import { HeroType } from "./hero-type";
import { EventStream } from "./message-bucket";
import { ValueContainer } from "./value-container";
import { ContractAttributeType } from "src/loot-hoarder-contract/contract-attribute-type";
import { Item } from "./item";
import { Inventory } from "./inventory";
import { ContractInventoryPosition } from "src/loot-hoarder-contract/contract-inventory-position";
import { ItemUnequippedEvent } from "./item-unequipped-event";
import { ItemAbilityParametersAttribute } from "./item-ability-parameters-attribute";

export class Hero {
  public dbModel: DbHero;
  public type: HeroType;
  public attributes: AttributeSet;
  public inventory: Inventory;
  public abilityTypes: AbilityType[];
  public maximumHealthVC: ValueContainer;
  
  public onLevelUp: Subject<number>;
  public onEvent: EventStream<ContractServerWebSocketMessage>;
  public onItemUnequipped: Subject<ItemUnequippedEvent>;

  private attributesFromLevel: AttributeSet;

  private constructor(
    dbModel: DbHero,
    type: HeroType,
    attributes: AttributeSet,
    inventory: Inventory,
  ) {
    this.dbModel = dbModel;
    this.type = type;
    this.attributes = attributes;
    this.inventory = inventory;
    this.onLevelUp = new Subject();
    this.onEvent = new EventStream();
    this.onItemUnequipped = new Subject();
    this.abilityTypes = dbModel.abilityTypeKeys.map(key => StaticGameContentService.instance.getAbilityType(key));
    this.maximumHealthVC = this.attributes.getAttribute(ContractAttributeType.maximumHealth, []).valueContainer;
    
    this.attributes.setAdditiveAttributeSet(this.type.baseAttributes);

    const attributesFromLevel = new AttributeSet();
    attributesFromLevel.setAdditiveAttributeSet(this.type.attributesPerLevel);
    attributesFromLevel.setMultiplicativeModifier(this, this.level);
    this.attributes.setAdditiveAttributeSet(attributesFromLevel);
    this.onLevelUp.subscribe(newLevel => attributesFromLevel.setMultiplicativeModifier(this, newLevel));
    this.attributesFromLevel = attributesFromLevel;

    this.setUpEventListeners();

    this.inventory.getAllItems().forEach(item => this.applyItemEffects(item));
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

  public equipItem(item: Item, inventoryPosition: ContractInventoryPosition): void {
    this.inventory.setItemAtPosition(item, inventoryPosition);
  }

  public unequipItem(inventoryPosition: ContractInventoryPosition): void {
    this.inventory.setItemAtPosition(undefined, inventoryPosition);
  }

  public toContractModel(): ContractHero {
    const attributes = this.attributes.toContractModel();
    const inventory = this.inventory.toContractModel();
      
    return {
      id: this.id,
      typeKey: this.type.key,
      name: this.name,
      level: this.level,
      experience: this.experience,
      attributes: attributes,
      inventory: inventory,
      cosmetics: {
        eyesId: this.dbModel.cosmetics.eyesId,
        noseId: this.dbModel.cosmetics.noseId,
        mouthId: this.dbModel.cosmetics.mouthId
      }
    };
  }

  private levelUp(): void {
    this.dbModel.level++;
    this.onLevelUp.next(this.dbModel.level);
  }

  private getExperienceRequiredForNextLevel(): number {
    return Math.pow(this.level, 1.5) * 100;
  }

  private applyItemEffects(item: Item): void {
    const allItemAbilities = item.getAllAbilities();
    for(const itemAbility of allItemAbilities) {
      switch(itemAbility.type.key) {
        case 'attribute': {
          if (!(itemAbility.parameters instanceof ItemAbilityParametersAttribute)) {
            throw Error ('Expected attribute ability to have attribute ability parameters.');
          }
          const isAdditive = itemAbility.parameters.isAdditive;
          const attributeType = itemAbility.parameters.attributeType;
          const abilityTags = itemAbility.parameters.abilityTags;
          const amount = itemAbility.parameters.amount;
          const attributes = this.attributes.getAttributes(attributeType, abilityTags);
          for(let attribute of attributes) {
            if (isAdditive){ 
              const attributeValueContainer = attribute.additiveValueContainer;
              attributeValueContainer.setAdditiveModifier(itemAbility, amount);
            } else {
              const attributeValueContainer = attribute.multiplicativeValueContainer;
              attributeValueContainer.setMultiplicativeModifier(itemAbility, amount);
            }
          }
        }
        break;
        default: throw Error (`Unhandled ability type: ${itemAbility.type.key}`);
      }
    }
  }

  private removeItemEffects(item: Item): void {
    const allItemAbilities = item.getAllAbilities();
    for(const itemAbility of allItemAbilities) {
      switch(itemAbility.type.key) {
        case 'attribute': {
          if (!(itemAbility.parameters instanceof ItemAbilityParametersAttribute)) {
            throw Error ('Expected attribute ability to have attribute ability parameters.');
          }
          const attribute = this.attributes.getAttribute(itemAbility.parameters.attributeType, itemAbility.parameters.abilityTags);
          const attributeValueContainer = itemAbility.parameters.isAdditive ? attribute.additiveValueContainer : attribute.multiplicativeValueContainer;
          attributeValueContainer.removeModifiers(itemAbility);
        }
        break;
        default: throw Error (`Unhandled ability type: ${itemAbility.type.key}`);
      }
    }
  }

  private setUpEventListeners(): void {
    this.attributes.onChange.subscribe(change => 
      this.onEvent.next(
        new ContractHeroAttributeChangedMessage(
          this.id, 
          change.type,
          [...change.tags],
          change.newAdditiveValue,
          change.newMultiplicativeValue,
          change.newValue
        )
      )
    );

    this.inventory.onItemEquipped.subscribe(event => {
      this.applyItemEffects(event.item);
      this.onEvent.next(
        new ContractItemEquippedMessage(this.id, event.item.toContractModel(), event.position)
      )
    });

    this.inventory.onItemUnequipped.subscribe(event => {
      this.removeItemEffects(event.item);
      this.onEvent.next(
        new ContractItemUnequippedMessage(this.id, event.item.id, event.position)
      );
      this.onItemUnequipped.next(event);
    });
  }

  public static load(dbModel: DbHero): Hero {
    const heroType = StaticGameContentService.instance.getHeroType(dbModel.typeKey);
    const attributes = new AttributeSet();
    const inventory = Inventory.load(dbModel.inventory);
    const hero = new Hero(dbModel, heroType, attributes, inventory);
    return hero;
  }
}
