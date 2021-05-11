import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { WebSocketService } from 'src/app/game/web-socket/web-socket.service';
import { ContractEquipItemMessage } from 'src/loot-hoarder-contract/client-actions/contract-equip-item-message';
import { ContractInventoryPosition } from 'src/loot-hoarder-contract/contract-inventory-position';
import { ContractItemCategory } from 'src/loot-hoarder-contract/contract-item-category';
import { Hero } from '../../client-representation/hero';
import { Item } from '../../client-representation/item';
import { ItemVisualPosition } from './item-visual-position';

@Component({
  selector: 'app-hero-with-items',
  templateUrl: './hero-with-items.component.html',
  styleUrls: ['./hero-with-items.component.scss']
})
export class HeroWithItemsComponent implements OnChanges {
  @Input()
  public hero!: Hero;
  @Input()
  public draggedItem?: Item;
  @Input()
  public canInteractWithItems: boolean = false;

  public itemVisualPositions: ItemVisualPosition[];

  public constructor(private readonly webSocketService: WebSocketService) {
    const head = new ItemVisualPosition(ContractInventoryPosition.head, 30, 0, 40, 28, 52, 40);
    const chest = new ItemVisualPosition(ContractInventoryPosition.chest, 30, 28, 40, 24, 52, 12);
    const legs = new ItemVisualPosition(ContractInventoryPosition.legs, 30, 52, 40, 24, 50, 19);
    const leftFoot = new ItemVisualPosition(ContractInventoryPosition.leftFoot, 0, 76, 50, 24, 72, 60);
    const rightFoot = new ItemVisualPosition(ContractInventoryPosition.rightFoot, 50, 76, 50, 24, 30, 58);
    const leftHand = new ItemVisualPosition(ContractInventoryPosition.leftHand, 0, 0, 30, 76, 62, 53);
    const rightHand = new ItemVisualPosition(ContractInventoryPosition.rightHand, 70, 0, 30, 76, 36, 55);
    this.itemVisualPositions = [
      legs,
      chest,
      head,
      leftFoot,
      rightFoot,
      leftHand,
      rightHand,
    ];
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.draggedItem) {
      this.updateAllowDrop();
    }
  }

  public getItemFromPosition(inventoryPosition: ContractInventoryPosition): Item | undefined {
    switch(inventoryPosition) {
      case ContractInventoryPosition.head: return this.hero.inventory.head;
      case ContractInventoryPosition.leftHand: return this.hero.inventory.leftHand;
      case ContractInventoryPosition.rightHand: return this.hero.inventory.rightHand;
      case ContractInventoryPosition.chest: return this.hero.inventory.chest;
      case ContractInventoryPosition.legs: return this.hero.inventory.legs;
      case ContractInventoryPosition.leftFoot: return this.hero.inventory.leftFoot;
      case ContractInventoryPosition.rightFoot: return this.hero.inventory.rightFoot;
    }
  }

  public handleItemDroppedOnInventoryPosition(inventoryPosition: ContractInventoryPosition): void {
    if (
      this.draggedItem 
      && this.canItemCategoryGoIntoInventoryPosition(this.draggedItem.type.category, inventoryPosition)
    ) {
      this.webSocketService.send(new ContractEquipItemMessage(this.hero.id, this.draggedItem.id, inventoryPosition));
    }
  }

  public handleDragOver(event: MouseEvent, itemVisualPosition: ItemVisualPosition): void {
    event.preventDefault();
    itemVisualPosition.draggedOver = true;
  }

  private updateAllowDrop(): void {
    for(let position of this.itemVisualPositions) {
      if (!this.draggedItem) {
        position.allowDrop = false;
      } else {
        position.allowDrop = this.canItemCategoryGoIntoInventoryPosition(this.draggedItem.type.category, position.inventoryPosition);
      }
    }
  }

  private canItemCategoryGoIntoInventoryPosition(category: ContractItemCategory, inventoryPosition: ContractInventoryPosition): boolean {
    switch(category) {
      case ContractItemCategory.weapon: {
        return inventoryPosition === ContractInventoryPosition.leftHand || inventoryPosition === ContractInventoryPosition.rightHand;
      }
      case ContractItemCategory.head: {
        return inventoryPosition === ContractInventoryPosition.head;
      }
      case ContractItemCategory.chest: {
        return inventoryPosition === ContractInventoryPosition.chest;
      }
      case ContractItemCategory.legs: {
        return inventoryPosition === ContractInventoryPosition.legs;
      }
      case ContractItemCategory.foot: {
        return inventoryPosition === ContractInventoryPosition.leftFoot || inventoryPosition === ContractInventoryPosition.rightFoot;
      }
      default: 
        throw Error (`Unhandled item category: ${category}`);
    }
  }
}
