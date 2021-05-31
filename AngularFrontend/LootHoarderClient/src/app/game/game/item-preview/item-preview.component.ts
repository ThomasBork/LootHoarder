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
    switch (ability.type.key) {
      case 'attribute': {
        const attributeType: ContractAttributeType = ability.parameters.attributeType;
        const abilityTags: string[] = ability.parameters.abilityTags;
        const amount: number = ability.parameters.amount;
        const attributeTypeText = `${attributeType}`;
        const abilityTagText = abilityTags.length > 0 ? abilityTags.join(' ') + ' ' : '';
        return abilityTagText + attributeTypeText + ' ' + amount;
      }
      default: 
        throw Error(`Unhandled ability type: ${ability.type.key}`);
    }
  }
}