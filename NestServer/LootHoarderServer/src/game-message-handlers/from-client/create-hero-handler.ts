import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { Hero } from "src/computed-game-state/hero";
import { DbHero } from "src/raw-game-state/db-hero";
import { HeroAdded } from "../from-server/hero-added";
import { CreateHero } from "./create-hero";

@CommandHandler(CreateHero)
export class CreateHeroHandler implements ICommandHandler<CreateHero> {
  public constructor(private readonly eventBus: EventBus) {

  }

  public async execute(command: CreateHero): Promise<void> {
    const dbHero: DbHero = {
      id: command.game.getNextHeroId(),
      typeKey: command.typeKey,
      name: command.name,
      level: 1,
      experience: 0,
    };

    const hero = Hero.load(dbHero);

    command.game.addHero(hero);

    this.eventBus.publish(new HeroAdded(command.game, hero));
  }
}
