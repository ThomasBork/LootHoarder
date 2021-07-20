import { Component, Input, OnInit } from '@angular/core';
import { CharacterBehaviorValueAttribute } from 'src/app/game/game/client-representation/character-behavior/character-behavior-value-attribute';
import { AbilityTagService } from 'src/app/shared/ability-tag.service';
import { AttributeTypeTranslator } from 'src/app/shared/attribute-type-translator';
import { ContractAttributeType } from 'src/loot-hoarder-contract/contract-attribute-type';

@Component({
  selector: 'app-behavior-value-attribute',
  templateUrl: './behavior-value-attribute.component.html',
  styleUrls: ['./behavior-value-attribute.component.scss']
})
export class BehaviorValueAttributeComponent implements OnInit {
  @Input()
  public value!: CharacterBehaviorValueAttribute;

  public allAttributeTypes: ContractAttributeType[];

  public availableAbilityTags: string[];

  private allAbilityTags: string[];

  public constructor (private readonly abilityTagService: AbilityTagService) {
    this.allAttributeTypes = Object.values(ContractAttributeType);

    this.allAbilityTags = [
      'fire',
      'lightning',
      'physical',
      'elemental',
      'attack',
      'spell',
      'debuff',
    ];

    this.availableAbilityTags = [];
  }

  public ngOnInit(): void {
    this.availableAbilityTags = this.getAvailableAbilityTags();
  }

  public translateAttributeType(attributeType: ContractAttributeType): string {
    return AttributeTypeTranslator.translate(attributeType);
  }

  public changeAbilityTag(previousTag: string, newTag: string): void {
    this.value.changeAbilityTag(previousTag, newTag);
    this.availableAbilityTags = this.getAvailableAbilityTags();
  }

  public selectAttributeType(attributeType: ContractAttributeType): void {
    this.value.attributeType = attributeType;
  }

  private getAvailableAbilityTags(): string[] {
    return this.allAbilityTags.filter(tag => !this.value.attributeAbilityTags.includes(tag));
  }
}
