import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Hero } from "src/computed-game-state/hero";
import { DbHero } from "src/raw-game-state/db-hero";
import { StaticGameContentService } from "src/services/static-game-content-service";
import { CreateHero } from "./create-hero";

@CommandHandler(CreateHero)
export class CreateHeroHandler implements ICommandHandler<CreateHero> {
  public constructor(
    private readonly staticGameContentService: StaticGameContentService
  ) {

  }

  public async execute(command: CreateHero): Promise<void> {
    const heroType = this.staticGameContentService.getHeroType(command.typeKey);

    // const dbAbilities = heroType.abilityTypes.map(abilityType => {
    //   const dbAbility: DbAbility = {
    //     id: command.game.getNextAbilityId(),
    //     typeKey: abilityType.key,
    //     remainingCooldown: 0
    //   };
    //   return dbAbility;
    // });

    const dbHero: DbHero = {
      id: command.game.getNextHeroId(),
      typeKey: command.typeKey,
      name: command.name,
      level: 1,
      experience: 0,
      abilityTypeKeys: heroType.abilityTypes.map(abilityType => abilityType.key)
    };

    const hero = Hero.load(dbHero);

    command.game.addHero(hero);
  }
}
