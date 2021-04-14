import { DbHero } from "src/raw-game-state/db-hero";
import { UIHero } from "src/ui-game-state/ui-hero";

export class Hero {
  public dbModel!: DbHero;

  private constructor() {}

  public get id(): number { return this.dbModel.id; }
  public get typeKey(): string { return this.dbModel.typeKey; }
  public get name(): string { return this.dbModel.name; }
  public get level(): number { return this.dbModel.level; }
  public get experience(): number { return this.dbModel.experience; }

  public getUIState(): UIHero {
    return {
      id: this.id,
      typeKey: this.typeKey,
      name: this.name,
      level: this.level,
      experience: this.experience
    };
  }

  public static load(dbModel: DbHero): Hero {
    const hero = new Hero();
    hero.dbModel = dbModel;
    return hero;
  }
}
