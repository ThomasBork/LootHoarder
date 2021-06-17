import { Injectable } from "@angular/core";

@Injectable()
export class AbilityTagService {
  public getColor(abilityTag: string): string {
    switch (abilityTag) {
      case "lightning": return 'yellow';
      case "fire": return 'orange';
      case "poison": return 'green';
      case "elemental": return 'purple';
      case "spell": return 'purple';
      case "physical": return 'grey';
      case "attack": return 'grey';
      default: return 'white';
    }
  }

  public translate(abilityTag: string): string {
    return abilityTag
      .split('-')
      .map(tagPart => tagPart[0].toUpperCase() + tagPart.substring(1))
      .join(' ');
  }
}