import { Component, Input } from "@angular/core";
import { Item } from "../client-representation/item";
import { ItemPassiveAbility } from "../client-representation/item-passive-ability";

@Component({
  selector: 'app-item-preview',
  templateUrl: './item-preview.component.html',
  styleUrls: ['./item-preview.component.scss']
})
export class ItemPreviewComponent {
  @Input()
  public item!: Item;

  public getAbilityText(itemAbility: ItemPassiveAbility): string {
    return `${itemAbility.ability.description}`;
  }
}