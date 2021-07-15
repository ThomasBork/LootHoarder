import { Component, Input } from "@angular/core";
import { AbilityTagService } from "src/app/shared/ability-tag.service";
import { NumberPrinter } from "src/app/shared/number-printer";
import { AbilityTextService } from "../ability-text-service";
import { AbilityType } from "../client-representation/ability-type";
import { AbilityTypeEffect } from "../client-representation/ability-type-effect";
@Component({
  selector: 'app-ability-type-preview',
  templateUrl: './ability-type-preview.component.html',
  styleUrls: ['./ability-type-preview.component.scss']
})
export class AbilityTypePreviewComponent {
  @Input()
  public abilityType!: AbilityType;

  public constructor(
    private readonly abilityTagService: AbilityTagService,
    private readonly abilityTextService: AbilityTextService
  ) { }

  public getAbilityTypeEffectDescription(effect: AbilityTypeEffect): string {
    return this.abilityTextService.getAbilityTypeEffectDescription(effect);
  }

  public getAbilityTagColor(tag: string): string {
    return this.abilityTagService.getColor(tag);
  }

  public getAbilityTagTranslation(tag: string): string {
    return this.abilityTagService.translate(tag);
  }

  public getNumberInSeconds(number: number): string {
    return NumberPrinter.printFloorOnNthDecimal(number / 1000, 1);
  }

  public getNumberInPercent(number: number): string {
    return NumberPrinter.printFloorOnNthDecimal(number * 100, 0);
  }
}