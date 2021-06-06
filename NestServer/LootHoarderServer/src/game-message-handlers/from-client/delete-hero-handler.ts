import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DeleteHero } from "./delete-hero";

@CommandHandler(DeleteHero)
export class DeleteHeroHandler implements ICommandHandler<DeleteHero> {
  public async execute(command: DeleteHero): Promise<void> {
    const hero = command.game.getHero(command.heroId);
    command.game.removeHero(hero);
  }
}
