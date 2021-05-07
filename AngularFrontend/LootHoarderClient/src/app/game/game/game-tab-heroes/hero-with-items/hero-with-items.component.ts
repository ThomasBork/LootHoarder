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

  public itemVisualPositions: ItemVisualPosition[];

  public constructor(private readonly webSocketService: WebSocketService) {
    this.itemVisualPositions = [
      new ItemVisualPosition(ContractInventoryPosition.legs, 30, 50, 40, 25, 50, 19),
      new ItemVisualPosition(ContractInventoryPosition.chest, 30, 25, 40, 25, 52, 12),
      new ItemVisualPosition(ContractInventoryPosition.head, 30, 0, 40, 25, 52, 40),
      new ItemVisualPosition(ContractInventoryPosition.leftFoot, 0, 75, 50, 25, 72, 60),
      new ItemVisualPosition(ContractInventoryPosition.rightFoot, 50, 75, 50, 25, 30, 58),
      new ItemVisualPosition(ContractInventoryPosition.leftHand, 0, 0, 30, 75, 62, 52),
      new ItemVisualPosition(ContractInventoryPosition.rightHand, 70, 0, 30, 75, 36, 54),
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
    console.log(this.draggedItem);
    if (this.draggedItem) {
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
