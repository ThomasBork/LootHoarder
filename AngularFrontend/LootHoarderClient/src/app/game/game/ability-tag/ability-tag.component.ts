import { Component, Input } from "@angular/core";
import { AbilityTagService } from "src/app/shared/ability-tag.service";

@Component({
  selector: 'app-ability-tag',
  templateUrl: './ability-tag.component.html',
  styleUrls: ['./ability-tag.component.scss']
})
export class AbilityTagComponent {
  @Input()
  public tag!: string;

  public constructor(private readonly abilityTagService: AbilityTagService) {

  }

  public get color(): string {
    return this.abilityTagService.getColor(this.tag);
  }

  public get translation(): string {
    return this.abilityTagService.translate(this.tag);
  }
}