import { Subject } from "rxjs";
import { ContractHero } from "src/loot-hoarder-contract/contract-hero";
import { ContractServerWebSocketMessage } from "src/loot-hoarder-contract/server-actions/contract-server-web-socket-message";
import { ContractHeroAbilityValueChangedMessage } from "src/loot-hoarder-contract/server-actions/contract-hero-ability-value-changed-message";
import { ContractHeroAbilityAddedMessage } from "src/loot-hoarder-contract/server-actions/contract-hero-ability-added-message";
import { ContractHeroAbilityRemovedMessage } from "src/loot-hoarder-contract/server-actions/contract-hero-ability-removed-message";
import { ContractHeroGainedExperienceMessage } from "src/loot-hoarder-contract/server-actions/contract-hero-gained-experience-message";
import { ContractHeroTookSkillNodeMessage } from "src/loot-hoarder-contract/server-actions/contract-hero-took-skill-node-message";
import { ContractHeroUnspentSkillPointsChangedMessage } from "src/loot-hoarder-contract/server-actions/contract-hero-unspent-skill-points-changed-message";
import { ContractHeroAttributeChangedMessage } from "src/loot-hoarder-contract/server-actions/contract-hero-attribute-changed-message";
import { ContractItemEquippedMessage } from "src/loot-hoarder-contract/server-actions/contract-item-equipped-message";
import { ContractItemUnequippedMessage } from "src/loot-hoarder-contract/server-actions/contract-item-unequipped-message";
import { ContractServerWebSocketMultimessage } from "src/loot-hoarder-contract/server-actions/contract-server-web-socket-multimessage";
import { DbHero } from "src/raw-game-state/db-hero";
import { StaticGameContentService } from "src/services/static-game-content-service";
import { AttributeSet } from "./attribute-set";
import { HeroType } from "./hero-type";
import { EventStream } from "./event-stream";
import { ValueContainer } from "./value-container";
import { ContractAttributeType } from "src/loot-hoarder-contract/contract-attribute-type";
import { Item } from "./item";
import { Inventory } from "./inventory";
import { ContractInventoryPosition } from "src/loot-hoarder-contract/contract-inventory-position";
import { ItemUnequippedEvent } from "./item-unequipped-event";
import { PassiveAbilityParametersAttribute } from "./passive-ability-parameters-attribute";
import { HeroSkillTreeNode } from "./hero-skill-tree-node";
import { PassiveAbility } from "./passive-ability";
import { ContractSkillNodeLocation } from "src/loot-hoarder-contract/contract-skill-node-location";
import { PassiveAbilityParametersUnlockAbility } from "./passive-ability-parameters-unlock-ability";
import { HeroAbility } from "./hero-ability";
import { DbHeroAbility } from "src/raw-game-state/db-hero-ability";
import { ContractPassiveAbilityTypeKey } from "src/loot-hoarder-contract/contract-passive-ability-type-key";
import { ContractHeroAbilityValueKey } from "src/loot-hoarder-contract/contract-hero-ability-value-key";

export class Hero {
  public dbModel: DbHero;
  public type: HeroType;
  public attributes: AttributeSet;
  public inventory: Inventory;
  public abilities: HeroAbility[];
  public maximumHealthVC: ValueContainer;
  public maximumManaVC: ValueContainer;

  public totalSkillPointsVC: ValueContainer;
  public takenSkillTreeNodes: HeroSkillTreeNode[];
  public availableSkillTreeNodes: HeroSkillTreeNode[];
  
  public onLevelUp: Subject<number>;
  public onEvent: EventStream<ContractServerWebSocketMessage>;
  public onItemUnequipped: Subject<ItemUnequippedEvent>;

  private constructor(
    dbModel: DbHero,
    type: HeroType,
    attributes: AttributeSet,
    inventory: Inventory,
    abilities: HeroAbility[],
    takenSkillTreeNodes: HeroSkillTreeNode[],
    availableSkillTreeNodes: HeroSkillTreeNode[]
  ) {
    this.dbModel = dbModel;
    this.type = type;
    this.attributes = attributes;
    this.inventory = inventory;
    this.abilities = abilities;

    this.onLevelUp = new Subject();
    this.onEvent = new EventStream();
    this.onItemUnequipped = new Subject();
    this.maximumHealthVC = this.attributes.getAttribute(ContractAttributeType.maximumHealth, []).valueContainer;
    this.maximumManaVC = this.attributes.getAttribute(ContractAttributeType.maximumMana, []).valueContainer;
    
    this.takenSkillTreeNodes = takenSkillTreeNodes;
    this.availableSkillTreeNodes = availableSkillTreeNodes;
    this.totalSkillPointsVC = new ValueContainer();
    this.totalSkillPointsVC.setAdditiveModifier(this, this.level);
    this.onLevelUp.subscribe(newLevel => this.totalSkillPointsVC.setAdditiveModifier(this, this.level));
    this.onLevelUp.subscribe(newLevel => {
      const message = new ContractHeroUnspentSkillPointsChangedMessage(this.id, this.unspentSkillPoints);
      this.onEvent.next(message);
    });

    this.attributes.setAdditiveAttributeValueSet(this.type.baseAttributes);

    for(const typeAttributePerLevelValueContainer of this.type.attributesPerLevel.attributeValueContainers) {
      const attributeFromLevelValueContainer = new ValueContainer();
      attributeFromLevelValueContainer.setAdditiveValueContainer(typeAttributePerLevelValueContainer.valueContainer);
      attributeFromLevelValueContainer.setMultiplicativeModifier(this, this.level);
      this.onLevelUp.subscribe(newLevel => attributeFromLevelValueContainer.setMultiplicativeModifier(this, newLevel));
      const combinedAttribute = this.attributes.getAttribute(typeAttributePerLevelValueContainer.attributeType, typeAttributePerLevelValueContainer.abilityTags);
      combinedAttribute.additiveValueContainer.setAdditiveValueContainer(attributeFromLevelValueContainer);
    }

    this.setUpAbilityValueContainers();

    this.setUpEventListeners();

    this.inventory.getAllItems().forEach(item => this.applyItemEffects(item));
    this.takenSkillTreeNodes.forEach(skillNode => this.applyPassiveAbilityEffects(skillNode.passiveAbilities));
  }

  public get id(): number { return this.dbModel.id; }
  public get name(): string { return this.dbModel.name; }
  public get level(): number { return this.dbModel.level; }
  public get experience(): number { return this.dbModel.experience; }
  public get unspentSkillPoints(): number { return this.totalSkillPointsVC.value - this.takenSkillTreeNodes.length; }

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

  public takeSkillNode(nodeX: number, nodeY: number): void {
    const node = this.availableSkillTreeNodes.find(n => n.x === nodeX && n.y === nodeY);
    if (!node) {
      throw Error (`Cannot take skill node at (${nodeX}, ${nodeY}) because it is not available.`);
    }

    if (this.unspentSkillPoints === 0) {
      throw Error (`Cannot take skill node when the hero does not have any unspent skill points.`);
    }

    this.onEvent.setUpNewEventBucket();
    const nodeIndex = this.availableSkillTreeNodes.indexOf(node);
    this.availableSkillTreeNodes.splice(nodeIndex, 1);
    this.takenSkillTreeNodes.push(node);
    this.applyPassiveAbilityEffects(node.passiveAbilities);

    const newAvailableSkillNodes = node.neighborNodes.filter(newNode => 
      !this.takenSkillTreeNodes.includes(newNode)
      && !this.availableSkillTreeNodes.includes(newNode)
    );
    this.availableSkillTreeNodes.push(...newAvailableSkillNodes);
    const newAvailableSkillNodeLocations: ContractSkillNodeLocation[] = newAvailableSkillNodes.map(newNode => {
      return {
        x: newNode.x,
        y: newNode.y
      };
    });

    const message = new ContractHeroUnspentSkillPointsChangedMessage(this.id, this.unspentSkillPoints);
    this.onEvent.next(message);

    const innerMessages = this.onEvent.flushEventBucket();
    const nodeMessage = new ContractHeroTookSkillNodeMessage(this.id, nodeX, nodeY, newAvailableSkillNodeLocations);
    const multimessage = new ContractServerWebSocketMultimessage([...innerMessages, nodeMessage]);
    this.onEvent.next(multimessage);
  }

  public toContractModel(): ContractHero {
    const attributes = this.attributes.toContractModel();
    const inventory = this.inventory.toContractModel();
    const takenSkillNodes: ContractSkillNodeLocation[] = this.takenSkillTreeNodes.map(node => {
      return {
        x: node.x,
        y: node.y
      };
    });
    const availableSkillNodes: ContractSkillNodeLocation[] = this.availableSkillTreeNodes.map(node => {
      return {
        x: node.x,
        y: node.y
      };
    });
    const abilities = this.abilities.map(ability => ability.toContractModel());

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
      },
      unspentSkillPoints: this.unspentSkillPoints,
      takenSkillNodes: takenSkillNodes,
      availableSkillNodes: availableSkillNodes,
      abilities: abilities
    };
  }

  private getNextAbilityId(): number {
    return this.dbModel.nextAbilityId++;
  }

  private levelUp(): void {
    this.dbModel.level++;
    this.onLevelUp.next(this.dbModel.level);
  }

  private getExperienceRequiredForNextLevel(): number {
    return Math.pow(this.level, 1.5) * 100;
  }

  private applyPassiveAbilityEffects(abilities: PassiveAbility[]): void {
    for(const ability of abilities) {
      switch(ability.type.key) {
        case ContractPassiveAbilityTypeKey.attribute: {
          if (!(ability.parameters instanceof PassiveAbilityParametersAttribute)) {
            throw Error ('Expected attribute ability to have attribute ability parameters.');
          }
          const isAdditive = ability.parameters.isAdditive;
          const attributeType = ability.parameters.attributeType;
          const abilityTags = ability.parameters.abilityTags;
          const amount = ability.parameters.amount;
          const attribute = this.attributes.getAttribute(attributeType, abilityTags);
          if (isAdditive){ 
            const attributeValueContainer = attribute.additiveValueContainer;
            attributeValueContainer.setAdditiveModifier(ability, amount);
          } else {
            const attributeValueContainer = attribute.multiplicativeValueContainer;
            attributeValueContainer.setMultiplicativeModifier(ability, amount);
          }
        }
        break;
        case ContractPassiveAbilityTypeKey.unlockAbility: {
          if (!(ability.parameters instanceof PassiveAbilityParametersUnlockAbility)) {
            throw Error ('Expected unlock ability ability to have unlock ability ability parameters.');
          }
          const abilityType = StaticGameContentService.instance.getAbilityType(ability.parameters.abilityTypeKey);
          if (!this.abilities.some(ability => ability.type === abilityType)) {
            const abilityId = this.getNextAbilityId();
            const dbHeroAbility: DbHeroAbility = {
              id: abilityId,
              isEnabled: true,
              typeKey: abilityType.key
            };
            const heroAbility = HeroAbility.load(dbHeroAbility);
            this.dbModel.abilities.push(dbHeroAbility);
            this.abilities.push(heroAbility);

            this.setUpAbilityValueContainersForAbility(heroAbility);

            const message = new ContractHeroAbilityAddedMessage(this.id, heroAbility.toContractModel());
            this.onEvent.next(message);
          }
        }
        break;
        default: throw Error (`Unhandled ability type for hero: ${ability.type.key}`);
      }
    }
  }

  private removePassiveAbilityEffects(abilities: PassiveAbility[]): void {
    for(const ability of abilities) {
      switch(ability.type.key) {
        case 'attribute': {
          if (!(ability.parameters instanceof PassiveAbilityParametersAttribute)) {
            throw Error ('Expected attribute ability to have attribute ability parameters.');
          }
          const attribute = this.attributes.getAttribute(ability.parameters.attributeType, ability.parameters.abilityTags);
          const attributeValueContainer = ability.parameters.isAdditive ? attribute.additiveValueContainer : attribute.multiplicativeValueContainer;
          attributeValueContainer.removeModifiers(ability);
        }
        break;
        case 'unlock-ability': {
          if (!(ability.parameters instanceof PassiveAbilityParametersUnlockAbility)) {
            throw Error ('Expected unlock ability ability to have unlock ability ability parameters.');
          }
          const abilityType = StaticGameContentService.instance.getAbilityType(ability.parameters.abilityTypeKey);
          const foundIndex = this.abilities.findIndex(ability => ability.type === abilityType);
          if (foundIndex < 0) {
            throw Error (`Tried to remove the ability type ${abilityType.key}, but it could not be found.`);
          }
          const removedAbility = this.abilities[foundIndex];
          this.abilities.splice(foundIndex, 1);

          const message = new ContractHeroAbilityRemovedMessage(this.id, removedAbility.id);
          this.onEvent.next(message);
        }
        break;
        default: throw Error (`Unhandled ability type for hero: ${ability.type.key}`);
      }
    }
  }

  private applyItemEffects(item: Item): void {
    const allItemAbilities = item.getAllAbilities();
    this.applyPassiveAbilityEffects(allItemAbilities);
  }

  private removeItemEffects(item: Item): void {
    const allItemAbilities = item.getAllAbilities();
    this.removePassiveAbilityEffects(allItemAbilities);
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
      );
    });

    this.inventory.onItemUnequipped.subscribe(event => {
      this.removeItemEffects(event.item);
      this.onEvent.next(
        new ContractItemUnequippedMessage(this.id, event.item.id, event.position)
      );
      this.onItemUnequipped.next(event);
    });
  }

  private setUpAbilityValueContainers(): void {
    for(const ability of this.abilities) {
      this.setUpAbilityValueContainersForAbility(ability);
    }
  }

  private setUpAbilityValueContainersForAbility(ability: HeroAbility): void {
    for(let effectIndex = 0; effectIndex < ability.effects.length; effectIndex++) {
      const effect = ability.effects[effectIndex];
      this.setUpAbilityValueContainer(effect.abilityTypeEffect.tags, effect.powerVC, ContractAttributeType.power);

      this.subscribeToHeroAbilityValueChange(effect.powerVC, ability.id, ContractHeroAbilityValueKey.power, effectIndex);
    }
    this.setUpAbilityValueContainer(ability.type.tags, ability.useSpeedVC, ContractAttributeType.useSpeed);
    this.setUpAbilityValueContainer(ability.type.tags, ability.cooldownSpeedVC, ContractAttributeType.cooldownSpeed);

    this.subscribeToHeroAbilityValueChange(ability.cooldownVC, ability.id, ContractHeroAbilityValueKey.cooldown, undefined);
    this.subscribeToHeroAbilityValueChange(ability.cooldownSpeedVC, ability.id, ContractHeroAbilityValueKey.cooldownSpeed, undefined);
    this.subscribeToHeroAbilityValueChange(ability.criticalStrikeChanceVC, ability.id, ContractHeroAbilityValueKey.criticalStrikeChance, undefined);
    this.subscribeToHeroAbilityValueChange(ability.manaCostVC, ability.id, ContractHeroAbilityValueKey.manaCost, undefined);
    this.subscribeToHeroAbilityValueChange(ability.timeToUseVC, ability.id, ContractHeroAbilityValueKey.timeToUse, undefined);
    this.subscribeToHeroAbilityValueChange(ability.useSpeedVC, ability.id, ContractHeroAbilityValueKey.useSpeed, undefined);
  }

  private setUpAbilityValueContainer(tags: string[], valueContainer: ValueContainer, attributeType: ContractAttributeType): void {
    const combinedAttribute = this.attributes.getAttribute(attributeType, tags);
    valueContainer.setAdditiveValueContainer(combinedAttribute.accumulatedAdditiveValueContainer);
    valueContainer.setMultiplicativeValueContainer(combinedAttribute.accumulatedMultiplicativeValueContainer);
  }

  private subscribeToHeroAbilityValueChange(valueContainer: ValueContainer, abilityId: number, valueKey: ContractHeroAbilityValueKey, effectIndex: number | undefined): void {
    valueContainer.onValueChange.subscribe(valueChangeEvent => {
      const message = new ContractHeroAbilityValueChangedMessage(
        this.id, 
        abilityId, 
        valueKey, 
        effectIndex,
        valueChangeEvent.newValue
      );
      this.onEvent.next(message);
    });
  }

  public static load(dbModel: DbHero): Hero {
    const heroType = StaticGameContentService.instance.getHeroType(dbModel.typeKey);
    const attributes = new AttributeSet();
    const inventory = Inventory.load(dbModel.inventory);
    const abilities = dbModel.abilities.map(ability => HeroAbility.load(ability));
    const skillTree = StaticGameContentService.instance.getHeroSkillTree();
    const takenSkillNodes = skillTree.getTakenNodesForHero(dbModel.skillNodesLocations);
    const availableSkillNodes = skillTree.getAvailableNodesForHero(dbModel.skillNodesLocations);
    const hero = new Hero(
      dbModel, 
      heroType,
      attributes,
      inventory,
      abilities,
      takenSkillNodes,
      availableSkillNodes
    );
    return hero;
  }
}
