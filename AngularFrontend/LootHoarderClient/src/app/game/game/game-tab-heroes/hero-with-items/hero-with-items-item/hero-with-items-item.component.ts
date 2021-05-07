import { Component, Input } from '@angular/core';
import { Item } from '../../../client-representation/item';
import { ContractInventoryPosition } from 'src/loot-hoarder-contract/contract-inventory-position';

@Component({
  selector: 'app-hero-with-items-item',
  templateUrl: './hero-with-items-item.component.html',
  styleUrls: ['./hero-with-items-item.component.scss']
})
export class HeroWithItemsItemComponent {
  @Input()
  public item?: Item;

  @Input()
  public inventoryPosition!: ContractInventoryPosition;

  @Input()
  public fixtureLeft!: number;

  @Input()
  public fixtureTop!: number;

  public get isImageMirrored(): boolean {
    return this.inventoryPosition === ContractInventoryPosition.rightFoot
      || this.inventoryPosition === ContractInventoryPosition.rightHand;
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
}
