import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Item } from '../../../client-representation/item';
import { ContractInventoryPosition } from 'src/loot-hoarder-contract/contract-inventory-position';

@Component({
  selector: 'app-hero-with-items-item',
  templateUrl: './hero-with-items-item.component.html',
  styleUrls: ['./hero-with-items-item.component.scss']
})
export class HeroWithItemsItemComponent implements OnChanges {
  @Input()
  public item?: Item;

  @Input()
  public inventoryPosition!: ContractInventoryPosition;

  @Input()
  public fixtureLeft!: number;

  @Input()
  public fixtureTop!: number;

  public previewLeft: number = 0;
  public previewTop: number = 0;

  private hoverCount: number = 0;

  public get isHovering(): boolean { return this.hoverCount > 0; }

  public get isImageMirrored(): boolean {
    return this.inventoryPosition === ContractInventoryPosition.rightFoot
      || this.inventoryPosition === ContractInventoryPosition.rightHand;
  }
  
  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.item) {
      this.hoverCount = 0;
      this.previewLeft = 0;
      this.previewTop = 0;
    }
  }

  public getImageLeft(): number {
    if (!this.item) {
      return 0;
    }
    if (this.isImageMirrored) {
      return 100 - this.item.type.fixtureLeft;
    }
    return - this.item.type.fixtureLeft;
  }

  public getImageTop(): number {
    if (!this.item) {
      return 0;
    }
    return -this.item.type.fixtureTop;
  }

  public getImageTransform(): string {
    const mirrorString = this.isImageMirrored ? 'scaleX(-1) ' : '';
    const translateXString = this.getImageLeft() + '%';
    const translateYString = this.getImageTop() + '%';
    return `${mirrorString} translate(${translateXString}, ${translateYString})`;
  }

  public handleMouseEnter(event: MouseEvent): void {
    this.hoverCount++;
    this.previewLeft = event.clientX + 20;
    this.previewTop = event.clientY - 100;
  }

  public handleMouseMove(event: MouseEvent): void {
    this.previewLeft = event.clientX + 20;
    this.previewTop = event.clientY - 100;
  }

  public handleMouseLeave(event: MouseEvent): void {
    this.hoverCount--;

    if(this.hoverCount < 0) {
      this.hoverCount = 0;
    }
  }
}
