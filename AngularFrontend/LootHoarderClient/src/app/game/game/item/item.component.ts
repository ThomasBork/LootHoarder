import { AfterViewInit, Component, ElementRef, Input, QueryList, ViewChild, ViewChildren } from "@angular/core";
import { ContractAttributeType } from "src/loot-hoarder-contract/contract-attribute-type";
import { Item } from "../client-representation/item";
import { PassiveAbility } from "../client-representation/passive-ability";

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent implements AfterViewInit {
  @Input()
  public item!: Item;

  @ViewChild("imageContainer")
  public imageContainerElementRef!: ElementRef;

  @ViewChildren("itemPreviewContainer")
  public itemPreviewContainerElementRefList!: QueryList<ElementRef>;

  public previewLeft: number = -10000; // Draw off-screen initially until the actual position can be calculated.
  public previewTop: number = -10000; // Draw off-screen initially until the actual position can be calculated.

  public isDragging: boolean = false;
  
  private hoverCount: number = 0;

  public get isHovering(): boolean { return this.hoverCount > 0; }

  public ngAfterViewInit(): void {
    this.itemPreviewContainerElementRefList.changes.subscribe(changes => 
      setTimeout(() => this.recalculatePreviewPosition(), 0)
    );
  }

  public getAbilityText(ability: PassiveAbility): string {
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

  private recalculatePreviewPosition(): void {
    if (this.itemPreviewContainerElementRefList.length === 0) {
      return;
    }
    const imageContainerElement: HTMLElement = this.imageContainerElementRef.nativeElement;
    const imageContainerBoundingRect = imageContainerElement.getBoundingClientRect();
    const imageContainerLeft = imageContainerBoundingRect.left;
    const imageContainerTop = imageContainerBoundingRect.top;
    const imageContainerWidth = imageContainerBoundingRect.width;
    const imageContainerHeight = imageContainerBoundingRect.height;
    const itemPreviewContainerElement: HTMLElement = this.itemPreviewContainerElementRefList.first.nativeElement;
    const itemPreviewContainerBoundingRect = itemPreviewContainerElement.getBoundingClientRect();
    const itemPreviewContainerWidth = itemPreviewContainerBoundingRect.width;
    const itemPreviewContainerHeight = itemPreviewContainerBoundingRect.height;
    const documentBoundingRect = document.documentElement.getBoundingClientRect();
    const documentWidth = documentBoundingRect.width;
    const documentHeight = documentBoundingRect.height;
    const maxPreviewLeft = documentWidth - itemPreviewContainerWidth;
    const maxPreviewTop = documentHeight - itemPreviewContainerHeight;

    let newPreviewLeft = imageContainerLeft + imageContainerWidth / 2 - itemPreviewContainerWidth / 2;
    let newPreviewTop = imageContainerTop - itemPreviewContainerHeight;

    if (newPreviewLeft < 0) {
      newPreviewLeft = 0;
    }
    if (newPreviewTop < 0) {
      newPreviewTop = 0;
    }
    if (newPreviewLeft > maxPreviewLeft) {
      newPreviewLeft = maxPreviewLeft;
    }
    if (newPreviewTop > maxPreviewTop) {
      newPreviewTop = maxPreviewTop;
    }

    this.previewLeft = newPreviewLeft;
    this.previewTop = newPreviewTop;
  }
}