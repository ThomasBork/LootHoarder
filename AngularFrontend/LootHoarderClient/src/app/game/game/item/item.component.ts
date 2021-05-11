import { Component, Input } from "@angular/core";
import { ContractAttributeType } from "src/loot-hoarder-contract/contract-attribute-type";
import { Item } from "../client-representation/item";
import { ItemAbility } from "../client-representation/item-ability";

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent {
  @Input()
  public item!: Item;

  public isDragging: boolean = false;
  
  private hoverCount: number = 0;

  public get isHovering(): boolean { return this.hoverCount > 0; }

  public getAbilityText(ability: ItemAbility): string {
    switch (ability.type.key) {
      case 'attribute': {
        const attributeType: ContractAttributeType = ability.parameters.attributeType;
        const abilityTag: string = ability.parameters.abilityTag;
        const amount: number = ability.parameters.amount;
        const attributeTypeText = `${attributeType}`;
        const abilityTagText = abilityTag ? abilityTag + ' ' : '';
        return abilityTagText + attributeTypeText + ' ' + amount;
      }
      default: 
        throw Error(`Unhandled ability type: ${ability.type.key}`);
    }
  }

  public startDragging(): void {
    this.isDragging = true;
    this.hoverCount = 0;
  }

  public stopDragging(): void {
    this.isDragging = false;
  }

  public handleMouseEnter(): void {
    this.hoverCount++;
  }

  public handleMouseLeave(): void {
    this.hoverCount--;

    if(this.hoverCount < 0) {
      this.hoverCount = 0;
    }
  }
}