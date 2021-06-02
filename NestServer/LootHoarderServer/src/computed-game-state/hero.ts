import { Subject } from "rxjs";
import { ContractHero } from "src/loot-hoarder-contract/contract-hero";
import { ContractServerWebSocketMessage } from "src/loot-hoarder-contract/server-actions/contract-server-web-socket-message";
import { ContractHeroGainedExperienceMessage } from "src/loot-hoarder-contract/server-actions/contract-hero-gained-experience-message";
import { ContractHeroTookSkillNodeMessage } from "src/loot-hoarder-contract/server-actions/contract-hero-took-skill-node-message";
import { ContractHeroUnspentSkillPointsChangedMessage } from "src/loot-hoarder-contract/server-actions/contract-hero-unspent-skill-points-changed-message";
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
import { PassiveAbilityParametersAttribute } from "./passive-ability-parameters-attribute";
import { HeroSkillTreeNode } from "./hero-skill-tree-node";
import { PassiveAbility } from "./passive-ability";
import { ContractSkillNodeLocation } from "src/loot-hoarder-contract/contract-skill-node-location";

export class Hero {
  public dbModel: DbHero;
  public type: HeroType;
  public attributes: AttributeSet;
  public inventory: Inventory;
  public abilityTypes: AbilityType[];
  public maximumHealthVC: ValueContainer;

  public totalSkillPointsVC: ValueContainer;
  public takenSkillTreeNodes: HeroSkillTreeNode[];
  public availableSkillTreeNodes: HeroSkillTreeNode[];
  
  public onLevelUp: Subject<number>;
  public onEvent: EventStream<ContractServerWebSocketMessage>;
  public onItemUnequipped: Subject<ItemUnequippedEvent>;

  private attributesFromLevel: AttributeSet;

  private constructor(
    dbModel: DbHero,
    type: HeroType,
    attributes: AttributeSet,
    inventory: Inventory,
    takenSkillTreeNodes: HeroSkillTreeNode[],
    availableSkillTreeNodes: HeroSkillTreeNode[],
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
    
    this.takenSkillTreeNodes = takenSkillTreeNodes;
    this.availableSkillTreeNodes = availableSkillTreeNodes;
    this.totalSkillPointsVC = new ValueContainer();
    this.totalSkillPointsVC.setAdditiveModifier(this, this.level);
    this.onLevelUp.subscribe(newLevel => this.totalSkillPointsVC.setAdditiveModifier(this, this.level));
    this.onLevelUp.subscribe(newLevel => {
      const message = new ContractHeroUnspentSkillPointsChangedMessage(this.id, this.unspentSkillPoints);
      this.onEvent.next(message);
    });

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
    };
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
        case 'attribute': {
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
        default: throw Error (`Unhandled ability type: ${ability.type.key}`);
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
        default: throw Error (`Unhandled ability type: ${ability.type.key}`);
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
    const skillTree = StaticGameContentService.instance.getHeroSkillTree();
    const takenSkillNodes = skillTree.getTakenNodesForHero(dbModel.skillNodesLocations);
    const availableSkillNodes = skillTree.getAvailableNodesForHero(dbModel.skillNodesLocations);
    const hero = new Hero(
      dbModel, 
      heroType,
      attributes,
      inventory,
      takenSkillNodes,
      availableSkillNodes
    );
    return hero;
  }
}
