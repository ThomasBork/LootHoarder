export class AbilityTagTranslator {
  public static translate(abilityTag: string): string {
    return abilityTag
      .split('-')
      .map(tagPart => tagPart[0].toUpperCase() + tagPart.substring(1))
      .join(' ');
  }
}