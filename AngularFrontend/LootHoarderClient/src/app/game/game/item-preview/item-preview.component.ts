import { Component, Input } from "@angular/core";
import { ContractAttributeType } from "src/loot-hoarder-contract/contract-attribute-type";
import { Item } from "../client-representation/item";
import { ItemAbility } from "../client-representation/item-ability";

@Component({
  selector: 'app-item-preview',
  templateUrl: './item-preview.component.html',
  styleUrls: ['./item-preview.component.scss']
})
export class ItemPreviewComponent {
  @Input()
  public item!: Item;

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
}