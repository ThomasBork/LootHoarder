import { Component, Input } from "@angular/core";
import { ContractAttributeType } from "src/loot-hoarder-contract/contract-attribute-type";
import { Item } from "../client-representation/item";
import { PassiveAbility } from "../client-representation/passive-ability";

@Component({
  selector: 'app-item-preview',
  templateUrl: './item-preview.component.html',
  styleUrls: ['./item-preview.component.scss']
})
export class ItemPreviewComponent {
  @Input()
  public item!: Item;

  public getAbilityText(ability: PassiveAbility): string {
    return ability.description;
  }
}